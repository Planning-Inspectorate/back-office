import { EventType } from '@pins/event-client';
import { eventClient } from '../../infrastructure/event-client.js';
import { NSIP_DOCUMENT } from '../../infrastructure/topics.js';
import { buildNsipDocumentPayload } from '../application/documents/document.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as documentVersionRepository from '../../repositories/document-metadata.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';

/**
 * @param {number} caseId
 */
export const getByCaseId = async (caseId) => {
	const folders = await folderRepository.getByCaseId(caseId);
	const documents = await Promise.all(
		folders.map((f) =>
			documentRepository.getDocumentsInFolder({ folderId: f.id, skipValue: 0, pageSize: 0 })
		)
	);

	return documents.flat();
};

/**
 * @param {string} guid
 * @param {string} status
 */
export const updateStatus = async (guid, status) => {
	const document = await documentRepository.getByDocumentGUID(guid);

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
