import { databaseConnector } from '#utils/database-connector.js';
import sanitizeHtml from 'sanitize-html';
import { allowedTags } from '../../applications/application/project-updates/project-updates.validators.js';
import { buildProjectUpdatePayload } from '../../applications/application/project-updates/project-updates.mapper.js';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_PROJECT_UPDATE } from '#infrastructure/topics.js';
/**
 * @typedef {import('../../../message-schemas/events/nsip-project-update.d.ts').NSIPProjectUpdate} NSIPProjectUpdate
 */

/**
 * @typedef {Object} NSIPProjectUpdateCaseData
 * @property {string} caseReference
 * @property {string} caseName
 * @property {string} caseDescription
 * @property {string} caseStage
 *
 * @typedef {NSIPProjectUpdate & NSIPProjectUpdateCaseData} NSIPProjectUpdateMigrateModel
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

		// We can't make migratedId unique because it's nullable, and MSSQL doesn't allow nullable unique fields
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

	const events = updatesToBroadcast.map(({ updatedEntity, caseReference }) =>
		buildProjectUpdatePayload(updatedEntity, caseReference)
	);

	await eventClient.sendEvents(NSIP_PROJECT_UPDATE, events, 'Update');
};

/**
 *
 * @param {NSIPProjectUpdateMigrateModel} m
 *
 * @returns {Promise<import('@prisma/client').ProjectUpdate>} projectUpdate
 */
const mapModelToEntity = async (m) => {
	const caseId = await getOrCreateCaseId(m);

	return {
		migratedId: m.id,
		caseId,
		...(m.updateDate && {
			dateCreated: new Date(m.updateDate),
			datePublished: new Date(m.updateDate)
		}),
		// sentToSubscribers flag will prevent the azure function from re-sending emails
		sentToSubscribers: true,
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
		// TODO: Do we also need to migrate update type?
	};
};

const caseRefToId = new Map();

/**
 * @param {NSIPProjectUpdateCaseData} projectUpdate
 *
 * @returns {Promise<number>} caseId
 */
const getOrCreateCaseId = async ({
	caseReference: reference,
	caseName: title,
	caseDescription: description,
	caseStage
}) => {
	const existingCaseId = caseRefToId.get(reference);

	if (existingCaseId) {
		return existingCaseId;
	}

	// Check if the case exists in the database
	let existingCase = await databaseConnector.case.findFirst({
		where: { reference },
		select: {
			id: true
		}
	});

	if (!existingCase) {
		// We're only creating (and not upserting) cases because upserts could be dangerous.
		// The stage is likely to change, but if we actually migrate nsip-project entities and re-run this job we would be in trouble
		const subSectorId = await getSubSectorIdFromReference(reference);

		const caseEntity = {
			reference,
			title,
			description,
			ApplicationDetails: {
				create: {
					subSector: {
						connect: { id: subSectorId }
					}
				}
			},
			CaseStatus: {
				create: { status: caseStage }
			}
		};

		existingCase = await databaseConnector.case.create({ data: caseEntity });
	}

	caseRefToId.set(reference, existingCase.id);

	return existingCase.id;
};

/**
 *
 * @param {string} reference
 *
 * @returns {Promise<number>} subSectorId
 */
const getSubSectorIdFromReference = async (reference) => {
	const abbreviation = reference?.slice(0, 4);

	if (!abbreviation) {
		throw Error(`Unable to determine sub sector for reference ${reference}`);
	}

	const subSector = await databaseConnector.subSector.findUnique({
		where: {
			abbreviation
		}
	});

	if (!subSector) {
		throw Error(`No subsector found for abbreviation ${abbreviation}`);
	}

	return subSector.id;
};
