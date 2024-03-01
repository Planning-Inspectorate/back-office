import logger from '#utils/logger.js';
import { eventClient } from './event-client.js';
import {
	FOLDER,
	NSIP_PROJECT,
	SERVICE_USER,
	NSIP_S51_ADVICE,
	NSIP_REPRESENTATION,
	NSIP_DOCUMENT
} from './topics.js';
import {
	isTrainingCase,
	verifyNotTraining
} from '../applications/application/application.validators.js';
import { EventType } from '@pins/event-client';
import { getAllByCaseId } from '#repositories/folder.repository.js';
import { filterAsync } from '#utils/async.js';

import { buildNsipProjectPayload } from '#infrastructure/payload-builders/nsip-project.js';
import { buildServiceUserPayload } from '#infrastructure/payload-builders/applicant.js';
import { buildFoldersPayload } from '#infrastructure/payload-builders/folder.js';
import { buildNsipS51AdvicePayload } from '#infrastructure/payload-builders/nsip-s51-advice.js';
import { buildNsipDocumentPayload } from '#infrastructure/payload-builders/nsip-document.js';
import {
	buildNsipRepresentationPayload,
	buildNsipRepresentationPayloadForPublish,
	buildRepresentationServiceUserPayload
} from '#infrastructure/payload-builders/nsip-representation.js';

import { verifyNotTrainingS51 } from '../applications/s51advice/s51-advice.validators.js';
import { batchSendEvents } from './event-batch-broadcaster.js';
import { buildDocumentFolderPath } from '../applications/application/documents/document.service.js';

const applicant = 'Applicant';

/**
 * @typedef {import('@pins/applications.api').Schema.S51Advice} S51Advice
 * @typedef {import('@prisma/client').Prisma.RepresentationGetPayload<{include: {case: true, user: true, represented: true, representative: true, attachments: true, representationActions: true} }>} RepresentationWithFullDetails
 * @typedef {import('@prisma/client').Prisma.DocumentVersionGetPayload<{include: {Document: {include: {folder: {include: {case: {include: {CaseStatus: true}}}}}}}}> } DocumentVersionWithDocumentAndFolder
 * @typedef {import('@prisma/client').Prisma.S51AdviceGetPayload<{include: {S51AdviceDocument: true}}>} S51AdviceWithS51AdviceDocuments
 */

/**
 * Broadcast events for an updated NSIP Project entity.
 *
 * This will always publish an update/publish/un-publish to the associated Applicant entity.
 * If we are starting a case, broadcast the folders create event.
 *
 * @param {import('@pins/applications.api').Schema.Case} project
 * @param {string} eventType
 * @param {object} [options]
 */
export const broadcastNsipProjectEvent = async (project, eventType, options = {}) => {
	try {
		await verifyNotTraining(project.id);
	} catch (/** @type {*} */ err) {
		logger.info('Aborted broadcasting event for project:', err.message);
		return;
	}

	await eventClient.sendEvents(NSIP_PROJECT, [buildNsipProjectPayload(project)], eventType);

	if (project.applicant && project.reference) {
		// We can't broadcast a service user until they have a role (i.e. there's a case reference)
		// This means that the consumers won't know about the applicant until the case creation has finished
		await eventClient.sendEvents(
			SERVICE_USER,
			[buildServiceUserPayload(project.applicant, project.reference, applicant)],
			eventType,
			{ entityType: applicant }
		);
	}

	if (options?.isCaseStart) {
		// We can safely call get all by case as it will only be the folders we have created.
		const caseFolders = await getAllByCaseId(project.id);
		await eventClient.sendEvents(
			FOLDER,
			buildFoldersPayload(caseFolders, project.reference),
			EventType.Create
		);
	}
};

/**
 * Broadcast events for an NSIP Document, works for single events or an array of docs
 *
 * @param {DocumentVersionWithDocumentAndFolder | DocumentVersionWithDocumentAndFolder[]} documents
 * @param {Object} additionalProperties
 * @param {EventType} eventType
 */
export const broadcastNsipDocumentEvent = async (
	documents,
	eventType,
	additionalProperties = {}
) => {
	// if a single event, make an array with that one in it
	const allDocuments = Array.isArray(documents) ? documents : [documents];

	// the events have already occurred, but we remove non-trainings from the list before broadcasting
	const eventPayloads = await Promise.all(
		(
			await filterAsync(async (doc) => {
				try {
					// @ts-ignore
					await verifyNotTraining(doc.Document.caseId);
					return true;
				} catch (/** @type {*} */ err) {
					logger.info(
						`Blocked sending event for document with guid ${doc.documentGuid}: `,
						err.message
					);
					return false;
				}
			}, allDocuments)
		).map(async (documentVersionWithDocumentFullInfo) => {
			// get the folder path and file name, needed for payload
			const filePath = await buildDocumentFolderPath(
				documentVersionWithDocumentFullInfo.Document.folderId,
				documentVersionWithDocumentFullInfo.Document.folder.case.reference,
				documentVersionWithDocumentFullInfo.fileName ?? ''
			);
			return buildNsipDocumentPayload(documentVersionWithDocumentFullInfo, filePath);
		})
	);

	if (eventPayloads.length) {
		await eventClient.sendEvents(NSIP_DOCUMENT, eventPayloads, eventType, additionalProperties);
	}
};

/**
 * Broadcast events for an NSIP S51 Advice entity, works for single events or an array
 *
 * @param {S51AdviceWithS51AdviceDocuments | S51AdviceWithS51AdviceDocuments[]} s51Advice
 * @param {EventType} eventType
 */
export const broadcastNsipS51AdviceEvent = async (s51Advice, eventType) => {
	// if a single event, make an array with that one in it
	const s51AdviceEvents = Array.isArray(s51Advice) ? s51Advice : [s51Advice];

	// the events have already occurred, but we remove non-trainings from the list before broadcasting
	const eventPayloads = await Promise.all(
		(
			await filterAsync(async (advice) => {
				try {
					await verifyNotTrainingS51(advice.id);
					return true;
				} catch (/** @type {*} */ err) {
					logger.info(`Blocked sending event for S51 with id ${advice.id}: `, err.message);
					return false;
				}
			}, s51AdviceEvents)
		).map(buildNsipS51AdvicePayload)
	);

	if (eventPayloads.length) {
		await eventClient.sendEvents(NSIP_S51_ADVICE, eventPayloads, eventType);
	}
};

/**
 * Broadcast a create / update event message to Service Bus, for a representation, and any service users (reps contact or agent)
 *
 * @param {RepresentationWithFullDetails} representation
 * @param {EventType} eventType
 * @returns
 */
export const broadcastNsipRepresentationEvent = async (
	representation,
	eventType = EventType.Update
) => {
	// dont send events for TRAINING cases
	if (!isTrainingCase(representation.case.caseRef)) {
		const nsipRepresentationPayload = buildNsipRepresentationPayload(representation);
		const serviceUsersPayload = buildRepresentationServiceUserPayload(representation);

		await eventClient.sendEvents(NSIP_REPRESENTATION, [nsipRepresentationPayload], eventType);

		// and service users
		await eventClient.sendEvents(SERVICE_USER, serviceUsersPayload, eventType, {
			entityType: 'RepresentationContact'
		});
	}
};

/**
 *
 * @param {RepresentationWithFullDetails[]} representations
 * @param {EventType} eventType
 * @param {number} caseId
 */
export const broadcastNsipRepresentationPublishEventBatch = async (
	representations,
	eventType = EventType.Publish,
	caseId
) => {
	// pull the ids from the reps array
	const representationIds = representations.map((rep) => rep.id);
	// TODO: DJW check this

	// dont send events for TRAINING cases
	const nsipRepresentationsPayload = representations.map(buildNsipRepresentationPayloadForPublish);
	const serviceUsersPayload = representations.flatMap(buildRepresentationServiceUserPayload);

	try {
		await verifyNotTraining(caseId);

		await batchSendEvents(NSIP_REPRESENTATION, nsipRepresentationsPayload, eventType);

		await batchSendEvents(SERVICE_USER, serviceUsersPayload, eventType, {
			entityType: 'RepresentationContact'
		});
	} catch (/** @type {*} */ err) {
		logger.info(`Blocked sending event for representations: ${representationIds}`, err.message);
	}
};
