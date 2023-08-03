import { EventType } from '@pins/event-client';
import { eventClient } from '../../infrastructure/event-client.js';
import { NSIP_DOCUMENT } from '../../infrastructure/topics.js';
import { buildNsipDocumentPayload } from '../application/documents/document.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as documentVersionRepository from '../../repositories/document-metadata.repository.js';

/**
 * @param {string} guid
 * @param {string} status
 */
export const updateStatus = async (guid, status) => {
	const document = await documentRepository.getByDocumentGUID(guid);

	if (!document) {
		return;
	}

	const updatePayload = {
		guid,
		status,
		version: document?.latestVersionId || 1
	};

	let updatedDocument;

	if (status === 'published') {
		// @ts-ignore
		updatePayload.datePublished = new Date();
		updatedDocument = await documentVersionRepository.updateDocumentPublishedStatus(updatePayload);
	} else {
		updatedDocument = await documentVersionRepository.updateDocumentStatus(updatePayload);
	}

	const eventType =
		updatedDocument.publishedStatus === 'published' ? EventType.Publish : EventType.Update;

	await eventClient.sendEvents(
		NSIP_DOCUMENT,
		[buildNsipDocumentPayload(updatedDocument)],
		eventType
	);

	return {
		caseId: document.caseId,
		guid: updatedDocument.documentGuid,
		status: updatedDocument.publishedStatus
	};
};
