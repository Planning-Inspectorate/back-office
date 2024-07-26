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
import * as folderRepository from '#repositories/folder.repository.js';
import { filterAsync } from '#utils/async.js';

import { buildNsipProjectPayload } from '#infrastructure/payload-builders/nsip-project.js';
import { buildServiceUserPayload } from '#infrastructure/payload-builders/service-user.js';
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
import * as representationRepository from '#repositories/representation.repository.js';

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
		logger.error({ error: err.message }, 'Aborted broadcasting event for project');
		return;
	}

	try {
		await eventClient.sendEvents(NSIP_PROJECT, [buildNsipProjectPayload(project)], eventType);
	} catch (/** @type {*} */ err) {
		logger.error(
			{ error: err.message },
			`Blocked sending event for nsip project with ID: ${project.id}`
		);
	}

	if (project.applicant && project.reference) {
		// We can't broadcast a service user until they have a role (i.e. there's a case reference)
		// This means that the consumers won't know about the applicant until the case creation has finished
		try {
			await eventClient.sendEvents(
				SERVICE_USER,
				[buildServiceUserPayload(project.applicant, project.reference, applicant)],
				eventType,
				{ entityType: applicant }
			);
		} catch (/** @type {*} */ err) {
			logger.error(
				{ error: err.message },
				`Blocked sending event for applicant with ID: ${applicant.id}`
			);
		}
	}

	if (options?.isCaseStart) {
		// We can safely call get all by case as it will only be the folders we have created.
		const caseFolders = await folderRepository.getAllByCaseId(project.id);
		try {
			await eventClient.sendEvents(
				FOLDER,
				buildFoldersPayload(caseFolders, project.reference),
				EventType.Create
			);
		} catch (/** @type {*} */ err) {
			logger.error(
				{ error: err.message },
				`Blocked sending event for folders with project ID: ${project.id}`
			);
		}
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
					logger.error(
						{ error: err.message },
						`Blocked sending event for document with guid: ${doc.documentGuid}`
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
		try {
			await eventClient.sendEvents(NSIP_DOCUMENT, eventPayloads, eventType, additionalProperties);
		} catch (/** @type {*} */ err) {
			logger.error({ error: err.message }, `Blocked sending events for documents`);
		}
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
					logger.error(
						{ error: err.message },
						`Blocked sending event for S51 with ID: ${advice.id}`
					);
					return false;
				}
			}, s51AdviceEvents)
		).map(buildNsipS51AdvicePayload)
	);

	if (eventPayloads.length) {
		try {
			await eventClient.sendEvents(NSIP_S51_ADVICE, eventPayloads, eventType);
		} catch (/** @type {*} */ err) {
			logger.error({ error: err.message }, `Blocked sending events for S51 Advices`);
		}
	}
};

/**
 * Broadcast a create / update event message to Service Bus, for a representation, and any service users (reps contact or agent)
 *
 * @param {Object} representation
 * @param {EventType} eventType
 * @returns
 */
export const broadcastNsipRepresentationEvent = async (
	representation,
	eventType = EventType.Update
) => {
	const representationFullDetails = await representationRepository.getById(representation.id);
	// dont send events for TRAINING cases
	if (!isTrainingCase(representationFullDetails.case.reference)) {
		const nsipRepresentationPayload = buildNsipRepresentationPayload(representationFullDetails);
		const serviceUsersPayload = buildRepresentationServiceUserPayload(representationFullDetails);
		try {
			await eventClient.sendEvents(NSIP_REPRESENTATION, [nsipRepresentationPayload], eventType);
		} catch (/** @type {*} */ err) {
			logger.error(
				{ error: err.message },
				`Blocked sending event for Representation with ID: ${representation.id}`
			);
		}
		try {
			// and service users
			await eventClient.sendEvents(SERVICE_USER, serviceUsersPayload, eventType, {
				entityType: 'RepresentationContact'
			});
		} catch (/** @type {*} */ err) {
			logger.error(
				{ error: err.message },
				`Blocked sending events for Service users with representation ID: ${representation.id}`
			);
		}
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
		logger.error(
			{ error: err.message },
			`Blocked sending event for representations: ${representationIds}`
		);
	}
};
