import { chunk as chunkArray } from 'lodash-es';
import { makePostRequest } from '../../common/back-office-api-client.js';
import { executeSequelizeQuery } from './execute-sequelize-query.js';

const MAX_BODY_ITEMS_LENGTH = 100;

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 * @param {boolean} isWelshCase
 */
export const migrateProjectUpdates = async (log, caseReferences, isWelshCase) => {
	log.info(`Migrating ${caseReferences.length} Cases`);

	for (const caseReference of caseReferences) {
		try {
			log.info(`Migrating project updates and subscriptions for case ${caseReference}`);

			const englishUpdates = await getProjectUpdatesEnglish(caseReference);
			log.info(`Retrieved ${englishUpdates.length} Project Updates from English DB`);
			const welshUpdates = isWelshCase ? await getProjectUpdatesWelsh(caseReference) : [];
			isWelshCase
				? log.info(`Retrieved ${welshUpdates.length} Project Updates from Welsh DB`)
				: null;

			if (isWelshCase && englishUpdates.length !== welshUpdates.length) {
				throw Error('Update entity count for English and Welsh do not match');
			}

			const updates = englishUpdates.map((englishUpdate, i) => ({
				...englishUpdate,
				updateContentEnglish: englishUpdate.updateContentEnglish || '',
				updateContentWelsh: welshUpdates[i]?.updateContentWelsh || null
			}));

			if (updates.length > 0) {
				log.info(`Migrating ${updates.length} project updates for case ${caseReference}`);

				const chunkedUpdates = chunkArray(updates, MAX_BODY_ITEMS_LENGTH);
				for (const chunk of chunkedUpdates) {
					await makePostRequest(log, '/migration/nsip-project-update', chunk);
				}

				log.info('Successfully migrated project updates');
			} else {
				log.warn(`No updates found for case ${caseReference}`);
			}

			const subscriptions = await getProjectSubscriptions(caseReference);

			if (subscriptions.length > 0) {
				log.info(`Migrating ${subscriptions.length} project updates for case ${caseReference}`);

				const chunkedSubscriptions = chunkArray(subscriptions, MAX_BODY_ITEMS_LENGTH);
				for (const chunk of chunkedSubscriptions) {
					await makePostRequest(log, '/migration/nsip-subscription', chunk);
				}

				log.info('Successfully migrated subscriptions');
			} else {
				log.warn(`No subscriptions found for case ${caseReference}`);
			}
		} catch (e) {
			log.error(`Failed to migrate project updates for case ${caseReference}`, e);
			throw e;
		}
	}
};

/**
 * @param {string} caseReference
 */
const getProjectUpdatesEnglish = async (caseReference) => {
	// Get all of the updates (They contain three additional properties; caseName, caseDescription and caseStage (int))
	const updates = await executeSequelizeQuery(getUpdatesQuery, [caseReference, caseReference]);

	updates.forEach((update) => {
		// @ts-ignore
		update.caseStage = getCaseStageFromId(update.caseStageId);

		// @ts-ignore
		if (update.updateStatus === 'publish') {
			// @ts-ignore
			update.updateStatus = 'published';
		}
	});

	return updates;
};

/**
 * @param {string} caseReference
 */
const getProjectUpdatesWelsh = async (caseReference) => {
	return await executeSequelizeQuery(getUpdatesQueryWelsh, [caseReference, caseReference], {
		queryWelshDb: true
	});
};

/**
 * @param {string} caseReference
 */
const getProjectSubscriptions = async (caseReference) => {
	const subscribers = await executeSequelizeQuery(getSubscriptionsQuery, [caseReference]);

	subscribers.forEach((subscription) => {
		// @ts-ignore
		subscription.caseStage = getCaseStageFromId(subscription.caseStage);

		// @ts-ignore
		const subscriptionType = subscriptionTypes[subscription.subscriptionType];

		if (!subscriptionType) {
			// @ts-ignore
			throw Error(
				// @ts-ignore
				`subscriptionType ${subscription.subscriptionType} invalid for subscription ${subscription.subscriptionId}`
			);
		}

		// @ts-ignore
		subscription.subscriptionType = subscriptionType;
	});

	return subscribers;
};

/**
 * Maps the NSIP Website stage id to our internal CBOS DB string value
 *
 * @param {number} caseStageId
 *
 * @returns {string} caseStage
 */
const getCaseStageFromId = (caseStageId) => {
	// @ts-ignore
	const caseStage = projectStages[caseStageId];

	if (!caseStage) {
		// @ts-ignore
		throw Error(`caseStage ${caseStageId} invalid`);
	}

	// @ts-ignore
	return caseStage;
};

const projectStages = {
	1: 'pre_application',
	2: 'acceptance',
	3: 'pre_examination',
	4: 'examination',
	5: 'recommendation',
	6: 'decision',
	7: 'post_decision',
	8: 'withdrawn'
};

const subscriptionTypes = {
	application_decided: 'applicationDecided',
	application_submitted: 'applicationSubmitted',
	registration_opens: 'registrationOpen',
	all_updates: 'allUpdates'
};

const getUpdatesQuery = `
SELECT p.id,
       pr.casereference AS caseReference,
       p.post_date      AS updateDate,
       p.post_title     AS updateName,
       p.post_content   AS updateContentEnglish,
       p.post_status    AS updateStatus,
       -- Additional columns we need to migrate to create cases
       pr.projectname   AS caseName,
       pr.summary       AS caseDescription,
       pr.stage         AS caseStageId
FROM   ipclive.wp_posts p
       INNER JOIN ipclive.wp_term_relationships r ON r.object_id = p.id
       INNER JOIN ipclive.wp_terms t ON r.term_taxonomy_id = t.term_id
       INNER JOIN ipclive.wp_ipc_projects pr ON LEFT(t.name, 8) = pr.casereference
WHERE  p.post_type = 'ipc_project_update'
       AND p.post_status IN( 'publish', 'draft' )
       AND pr.casereference = ?
GROUP  BY id
UNION
SELECT *
FROM ipclive.vw_projectUpdateMigration
WHERE casereference = ?;`;

const getUpdatesQueryWelsh = `
SELECT p.id,
       pr.casereference AS caseReference,
       p.post_content   AS updateContentWelsh,
FROM   ipccy.wp_posts p
       INNER JOIN ipccy.wp_term_relationships r ON r.object_id = p.id
       INNER JOIN ipccy.wp_terms t ON r.term_taxonomy_id = t.term_id
       INNER JOIN ipccy.wp_ipc_projects pr ON LEFT(t.name, 8) = pr.casereference
WHERE  p.post_type = 'ipc_project_update'
       AND p.post_status IN( 'publish', 'draft' )
       AND pr.casereference = ?
GROUP  BY id
UNION
SELECT *
FROM ipccy.vw_projectUpdateMigration_cy
WHERE casereference = ?;`;

const getSubscriptionsQuery = `
SELECT s.user_id   AS subscriptionId,
       s.case_reference     AS caseReference,
       s.useremail          AS emailAddress,
       sc.subscription_type AS subscriptionType,
       sc.subscription_date AS startDate,
       -- Additional columns we need to migrate to create cases
       pr.projectname   AS caseName,
       pr.summary       AS caseDescription,
       pr.stage         AS caseStage
FROM   ipclive.wp_ipc_subscribers s
       INNER JOIN ipclive.wp_ipc_subscriptions sc ON s.user_id = sc.user_id
       INNER JOIN ipclive.wp_ipc_projects pr ON s.case_reference = pr.casereference
WHERE  verified = 1
AND s.case_reference = ?;`;
