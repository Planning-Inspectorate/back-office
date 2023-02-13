import { pick } from 'lodash-es';
import * as documentRepository from '../../../repositories/document.repository.js';
import BackOfficeAppError from '../../../utils/app-error.js';
import { mapSingleDocumentDetails } from '../../../utils/mapping/map-document-details.js';
import { applicationStates } from '../../state-machine/application.machine.js';
import { obtainURLsForDocuments } from './document.service.js';
import { fetchDocumentByGuidAndCaseId } from './document.validators.js';
/**
 * @typedef {import('apps/api/prisma/schema.js').Document} Document
 * @typedef {import('apps/api/prisma/schema.js').DocumentDetails} DocumentDetails
 */

/**
 *
 * @type {import('express').RequestHandler<any, ?, ?, any>}
 */
export const provideDocumentUploadURLs = async ({ params, body }, response) => {
	const documentsToUpload = body[''];

	const { blobStorageHost, blobStorageContainer, documents } = await obtainURLsForDocuments(
		documentsToUpload,
		params.id
	);

	const documentsWithUrls = documents.map((document) => {
		return pick(document, ['documentName', 'blobStoreUrl']);
	});

	response.send({
		blobStorageHost,
		blobStorageContainer,
		documents: documentsWithUrls
	});
};

/**
 * Updates the status and / or redaction status of an array of documents
 * There can be a status parameter, or a redacted parameter, or both
 *
 * @type {import('express').RequestHandler<{id: number}, ?, ?, any>}
 */
export const updateDocuments = async ({ body }, response) => {
	const { status, redacted, items } = body[''];

	if (items) {
		for (const document of items) {
			await documentRepository.update(document.guid, { status, redacted });
		}
	}
	response.send(items);
};

/**
 * Gets the properties for a single document
 *
 * @type {import('express').RequestHandler<{guid: string}, ?, ?, any>}
 */
export const getDocumentProperties = async ({ params }, response) => {
	let /** @type { Document |null} */ document = null;
	let /** @type { DocumentDetails |null} */ documentDetails = null;

	try {
		document = await documentRepository.getById(params.guid);

		if (document === null || typeof document === 'undefined') {
			throw new BackOfficeAppError(`Unknown document guid ${params.guid}`, 404);
		}
		documentDetails = mapSingleDocumentDetails(document);
	} catch {
		throw new BackOfficeAppError(`Unknown document guid ${params.guid}`, 404);
	}

	response.send(documentDetails);
};

/**
 * Soft deletes a document by its GUID and case ID.
 *
 *@async
 * @type {import('express').RequestHandler<{id:string; guid: string;}, ?, ?, any>}
 * @throws {BackOfficeAppError} If the document is published, or if the document cannot be deleted for any other reason.
 * @returns {Promise<void>} An object with the key "isDeleted" set to true.
 */
export const deleteDocumentSoftly = async ({ params: { id: caseId, guid } }, response) => {
	const document = await fetchDocumentByGuidAndCaseId(guid, +caseId);

	const documentIsPublished = document.status === applicationStates.published;

	if (documentIsPublished) {
		throw new BackOfficeAppError(
			`unable to delete document guid ${guid} related to casedId ${caseId}`,
			400
		);
	}

	await documentRepository.deleteDocument(guid);

	response.status(200).send({ isDeleted: true });
};
