import { databaseConnector } from '#utils/database-connector.js';
import sanitizeHtml from 'sanitize-html';
import { allowedTags } from '../../applications/application/project-updates/project-updates.validators.js';
import { buildProjectUpdatePayload } from '../../applications/application/project-updates/project-updates.mapper.js';
import { getOrCreateMinimalCaseId, sendChunkedEvents } from './utils.js';
import { buildUpsertForEntity } from './sql-tools.js';
import { NSIP_PROJECT_UPDATE } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { MigratedEntityIdCeiling } from '../migrator.consts.js';
/**
 * @typedef {import('../../../message-schemas/events/nsip-project-update.d.ts').NSIPProjectUpdate} NSIPProjectUpdate
 * @typedef {NSIPProjectUpdate & import('./utils.js').NSIPProjectMinimalCaseData} NSIPProjectUpdateMigrateModel
 */

const published = 'published';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {NSIPProjectUpdateMigrateModel[]} projectUpdates
 */
export const migrateNsipProjectUpdates = async (projectUpdates) => {
	console.info(`Migrating ${projectUpdates.length} project updates`);

	for (const model of projectUpdates) {
		const entity = await mapModelToEntity(model);

		if (entity.id >= MigratedEntityIdCeiling) {
			throw Error(`Unable to migrate entity id=${entity.id} - identity above threshold`);
		}

		const { statement, parameters } = buildUpsertForEntity('ProjectUpdate', entity, 'id');

		await databaseConnector.$transaction([
			databaseConnector.$executeRawUnsafe(statement, ...parameters)
		]);
	}

	const { publishEvents, updateEvents } = await buildEventPayloads(
		projectUpdates.map((update) => update.id)
	);

	// We're only migrating published project updates, so publish everything
	if (publishEvents.length > 0) {
		console.info(`Broadcasting ${publishEvents.length} Project Update PUBLISH events`);
		await sendChunkedEvents(NSIP_PROJECT_UPDATE, publishEvents, EventType.Publish);
	}

	if (updateEvents.length > 0) {
		console.info(`Broadcasting ${publishEvents.length} Project Update UPDATE events`);
		await sendChunkedEvents(NSIP_PROJECT_UPDATE, updateEvents, EventType.Update);
	}
};

/**
 * @typedef {Object} EventsToBroadcast
 * @property {NSIPProjectUpdate[]} publishEvents
 * @property {NSIPProjectUpdate[]} updateEvents
 */

/**
 *
 * @param {number[]} projectUpdateIds
 *
 * @returns {Promise<EventsToBroadcast>} eventsToBroadcast
 */
const buildEventPayloads = async (projectUpdateIds) => {
	const updatesToBroadcast = await databaseConnector.projectUpdate.findMany({
		where: { id: { in: projectUpdateIds } },
		include: {
			case: true
		}
	});

	return updatesToBroadcast.reduce(
		(/** @type {EventsToBroadcast} */ events, entity) => {
			// @ts-ignore - case reference will never be undefined here
			const payload = buildProjectUpdatePayload(entity, entity.case.reference);

			if (entity.status === published) {
				events.publishEvents.push(payload);
			} else {
				events.updateEvents.push(payload);
			}

			return events;
		},
		{ publishEvents: [], updateEvents: [] }
	);
};

/**
 *
 * @param {NSIPProjectUpdateMigrateModel} m
 *
 * @returns {Promise<import('@prisma/client').ProjectUpdate>} projectUpdate
 */
const mapModelToEntity = async (m) => {
	const caseId = await getOrCreateMinimalCaseId(m);

	return {
		id: m.id,
		caseId,
		...(m.updateDate && {
			dateCreated: new Date(m.updateDate),
			datePublished: m.updateStatus === published ? new Date(m.updateDate) : null
		}),
		// sentToSubscribers flag will prevent the azure function from re-sending emails
		sentToSubscribers: m.updateStatus === published,
		emailSubscribers: true,
		status: m.updateStatus,
		// @ts-ignore
		title: m.updateName,
		htmlContent: prepareAndSanitizeHtml(m.updateContentEnglish)
	};
};

const cr = '\r';
const lf = '\n';

const crlf = cr + lf;

const breakElement = '<br />';

const http = 'http://';

const https = 'https://';

/**
 * The HTML editor only supports break elements, but the migrated wordpress data comes over using carriage returns and line break control characters.
 * Replace these manually to make the content compatible with the editor.
 *
 * There are also 'http' links in some of the updates which will be stripped by the sanitiser. We can manually covert these to https before migrating.
 *
 * @param {string} html
 *
 * @returns {string} sanitizedHtml
 */
const prepareAndSanitizeHtml = (html) => {
	if (!html) {
		// Support empty content by returning
		return html;
	}

	const htmlWithLineBreaks = html
		.replaceAll(crlf, breakElement)
		.replaceAll(cr, breakElement)
		.replaceAll(lf, breakElement);

	const htmlWithHttpReplaced = htmlWithLineBreaks.replaceAll(http, https);

	return sanitizeHtml(htmlWithHttpReplaced, {
		allowedTags,
		allowedAttributes: {
			a: ['href']
		},
		allowedSchemes: ['https']
	});
};
