import { QueryTypes, Sequelize } from 'sequelize';
import { loadConfig } from './config.js';
import { makePostRequest } from './back-office-api-client.js';

const config = loadConfig();
const { username, password, database, host, port, dialect } = config.wordpressDatabase;

const sequelize = new Sequelize(database, username, password, {
	host,
	port: Number(port),
	// @ts-ignore
	dialect
});

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 */
export const migrateProjectUpdates = async (log, caseReferences) => {
	log.info(`Migrating ${caseReferences.length} Cases`);

	for (const caseReference of caseReferences) {
		try {
			log.info(`Migrating project updates and subscriptions for case ${caseReference}`);

			const updates = await getProjectUpdates(log, caseReference);

			if (updates.length > 0) {
				log.info(`Migrating ${updates.length} project updates for case ${caseReference}`);

				await makePostRequest(log, '/migration/nsip-project-update', updates);

				log.info('Successfully migrated project updates');
			} else {
				log.warn(`No updates found for case ${caseReference}`);
			}

			const subscriptions = await getProjectSubscriptions(log, caseReference);

			if (subscriptions.length > 0) {
				log.info(`Migrating ${subscriptions.length} project updates for case ${caseReference}`);

				await makePostRequest(log, '/migration/nsip-subscription', subscriptions);

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
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
const getProjectUpdates = async (log, caseReference) => {
	// Get all of the updates (They contain three additional properties; caseName, caseDescription and caseStage (int))
	const updates = await sequelize.query(getUpdatesQuery, {
		replacements: [caseReference],
		type: QueryTypes.SELECT
	});

	updates.forEach((update) => {
		// @ts-ignore
		const caseStage = projectStages[update.caseStage];

		if (!caseStage) {
			// @ts-ignore
			throw Error(`caseStage ${update.caseStage} invalid for update ${update.id}`);
		}

		// @ts-ignore
		update.caseStage = caseStage;
		// @ts-ignore
		update.updateStatus = 'published';
	});

	return updates;
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
const getProjectSubscriptions = async (log, caseReference) => {
	const subscribers = await sequelize.query(getSubscriptionsQuery, {
		replacements: [caseReference],
		type: QueryTypes.SELECT
	});

	subscribers.forEach((subscription) => {
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

const projectStages = {
	1: 'Pre-application',
	2: 'Acceptance (review of the application)',
	3: 'Pre-examination',
	4: 'Examination',
	5: 'Recommendation',
	6: 'Decision',
	7: 'Decided',
	8: 'Withdrawn'
};

const subscriptionTypes = {
	application_decided: 'applicationDecided',
	application_submitted: 'applicationSubmitted',
	registration_opens: 'registrationOpen',
	all_updates: 'allUpdates'
};

const getUpdatesQuery = `SELECT p.id,
       pr.casereference AS caseReference,
       p.post_date      AS updateDate,
       p.post_title     AS updateName,
       p.post_content   AS updateContentEnglish,
       -- Additional columns we need to migrate to create cases
       pr.projectname   AS caseName,
       pr.summary       AS caseDescription,
       pr.stage         AS caseStage
FROM   ipclive.wp_posts p
       INNER JOIN ipclive.wp_term_relationships r ON r.object_id = p.id
       INNER JOIN ipclive.wp_terms t ON r.term_taxonomy_id = t.term_id
       INNER JOIN ipclive.wp_ipc_projects pr ON LEFT(t.NAME, 8) = pr.casereference
WHERE  p.post_type = 'ipc_project_update'
       AND p.post_status = 'publish'
       AND pr.casereference = ?
ORDER  BY post_date DESC;`;

const getSubscriptionsQuery = `SELECT sc.subscription_id   AS subscriptionId,
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
