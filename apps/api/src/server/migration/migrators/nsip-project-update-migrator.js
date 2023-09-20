import { databaseConnector } from '#utils/database-connector.js';
import sanitizeHtml from 'sanitize-html';
import { allowedTags } from '../../applications/application/project-updates/project-updates.validators.js';
import { buildProjectUpdatePayload } from '../../applications/application/project-updates/project-updates.mapper.js';
import { NSIP_PROJECT_UPDATE } from '#infrastructure/topics.js';
import { getOrCreateMinimalCaseId, sendChunkedEvents } from './utils.js';
import { EventType } from '@pins/event-client';
/**
 * @typedef {import('../../../message-schemas/events/nsip-project-update.d.ts').NSIPProjectUpdate} NSIPProjectUpdate
 * @typedef {NSIPProjectUpdate & import('./utils.js').NSIPProjectMinimalCaseData} NSIPProjectUpdateMigrateModel
 */

/**
 * @typedef {Object} UpdateToBroadcast
 * @property {string} caseReference
 * @property {import('@prisma/client').ProjectUpdate} updatedEntity
 */

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {NSIPProjectUpdateMigrateModel[]} projectUpdates
 */
export const migrateNsipProjectUpdates = async (projectUpdates) => {
	console.info(`Migrating ${projectUpdates.length} project updates`);

	/** @type {UpdateToBroadcast[]} */
	const updatesToBroadcast = [];

	for (const model of projectUpdates) {
		const entity = await mapModelToEntity(model);

		// We can't make migratedId unique because it's nullable, and Prisma won't allow us to create a nullable unique index in MSSQL
		// In MSSQL, this can only be achieved with a filtered index (where column is not null)
		// Since it can't be unique, we can't use upsert - so we have to deal with this manually
		const existingUpdate = await databaseConnector.projectUpdate.findFirst({
			where: { migratedId: entity.migratedId },
			select: { id: true }
		});

		const updatedEntity = existingUpdate
			? await databaseConnector.projectUpdate.update({
					where: { id: existingUpdate.id },
					data: entity
			  })
			: // We also can't do bulk creates because createMany won't give us back the new entity, which we need to build the payload
			  await databaseConnector.projectUpdate.create({
					data: entity
			  });

		updatesToBroadcast.push({ updatedEntity, caseReference: model.caseReference });
	}

	// Broadcast all updates
	console.info(`Broadcasting updates for ${updatesToBroadcast.length} entities`);

	const { publishEvents, updateEvents } = buildEventPayloads(updatesToBroadcast);

	// We're only migrating published project updates, so publish everything
	if (publishEvents.length > 0) {
		await sendChunkedEvents(NSIP_PROJECT_UPDATE, publishEvents, EventType.Publish);
	}

	if (updateEvents.length > 0) {
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
 * @param {UpdateToBroadcast[]} updatesToBroadcast
 *
 * @returns {EventsToBroadcast} eventsToBroadcast
 */
const buildEventPayloads = (updatesToBroadcast) => {
	return updatesToBroadcast.reduce(
		(/** @type {EventsToBroadcast} */ events, { updatedEntity, caseReference }) => {
			const payload = buildProjectUpdatePayload(updatedEntity, caseReference);

			if (updatedEntity.status === 'published') {
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
		migratedId: m.id,
		caseId,
		...(m.updateDate && {
			dateCreated: new Date(m.updateDate),
			datePublished: m.updateStatus === 'published' ? new Date(m.updateDate) : null
		}),
		// sentToSubscribers flag will prevent the azure function from re-sending emails
		sentToSubscribers: m.updateStatus === 'published',
		emailSubscribers: true,
		status: m.updateStatus,
		// @ts-ignore
		title: m.updateName,
		htmlContent: sanitizeHtml(m.updateContentEnglish, {
			allowedTags,
			allowedAttributes: {
				a: ['href']
			},
			allowedSchemes: ['https']
		})
	};
};
