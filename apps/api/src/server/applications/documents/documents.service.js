import { EventType } from '@pins/event-client';
import { eventClient } from '../../infrastructure/event-client.js';
import { NSIP_DOCUMENT } from '../../infrastructure/topics.js';
import { buildNsipDocumentPayload } from '../application/documents/document.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as documentVersionRepository from '../../repositories/document-metadata.repository.js';
import { nextStatusInDocumentStateMachine } from '../application/application.service.js';

/**
 * @param {string} guid
 * @param {string} newStatus
 */
export const updateStatus = async (guid, newStatus) => {
	const document = await documentRepository.getByDocumentGUID(guid);

	const currentDocumentStatus = document?.documentVersion[0]?.publishedStatus;

	/** @type {string} */
	// @ts-ignore
	const status = nextStatusInDocumentStateMachine(currentDocumentStatus, newStatus);

	const updatedDocument = await documentVersionRepository.updateDocumentStatus({
		guid,
		status,
		version: document.latestVersionId
	});

	const eventType =
		updatedDocument.publishedStatus === 'published' ? EventType.Publish : EventType.Update;

	await eventClient.sendEvents(
		NSIP_DOCUMENT,
		[buildNsipDocumentPayload(updatedDocument)],
		eventType
	);

	return {
		caseId: updatedDocument.caseId,
		guid: updatedDocument.documentGuid,
		status: updatedDocument.publishedStatus
	};
};
