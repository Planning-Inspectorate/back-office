import { pick } from 'lodash-es';
import * as documentRepository from '../../../repositories/document.repository.js';
import * as DocumentVersionRepository from '../../../repositories/document-metadata.repository.js';
import BackOfficeAppError from '../../../utils/app-error.js';
import { mapSingleDocumentDetailsFromVersion } from '../../../utils/mapping/map-document-details.js';
import { applicationStates } from '../../state-machine/application.machine.js';
import {
	obtainURLsForDocuments,
	upsertDocumentVersionAndReturnDetails
} from './document.service.js';
import {
	fetchDocumentByGuidAndCaseId,
	validateDocumentVersionBody
} from './document.validators.js';

/**
 * @typedef {import('apps/api/prisma/schema.js').Document} Document
 * @typedef {import('apps/api/prisma/schema.js').DocumentDetails} DocumentDetails
 * @typedef {import('apps/api/prisma/schema.js').DocumentVersionInput} DocumentVersion
 */

/**
 *
 * @type {import('express').RequestHandler<any, any, { blobStorageHost: string, blobStorageContainer: string, documents: { documentName: string, blobStoreUrl: string }[] } | any, any>}
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
 * @type {import('express').RequestHandler<{id: number}, any, any, any>}
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
 * Gets the properties/metadata for a single document
 *
 * @type {import('express').RequestHandler<{id: string;guid: string}, ?, ?, any>}
 * @throws {BackOfficeAppError} if the metadata cannot be stored in the database.
 * @returns {Promise<void>} A Promise that resolves when the metadata has been successfully stored in the database.
 */
export const getDocumentProperties = async ({ params: { id: caseId, guid } }, response) => {
	const document = await fetchDocumentByGuidAndCaseId(guid, +caseId);

	const DocumentVersion = await DocumentVersionRepository.getById(document.guid);

	if (DocumentVersion === null || typeof DocumentVersion === 'undefined') {
		throw new BackOfficeAppError(`Unknown document metadata guid ${guid}`, 404);
	}

	const documentDetails = mapSingleDocumentDetailsFromVersion(DocumentVersion);

	response.status(200).send(documentDetails);
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

/**
 * Creates or updates a document metadata record in the database.
 *
 * @async
 * @function
 * @name storeDocumentVersion
 * @type {import('express').RequestHandler<{id: string; guid:string;}, ?, ?, any>}
 * @throws {BackOfficeAppError} if the metadata cannot be stored in the database.
 * @returns {Promise<void>} A Promise that resolves when the metadata has been successfully stored in the database.
 */
export const storeDocumentVersion = async (request, response) => {
	const { id: caseId, guid } = request.params;

	/** @type {DocumentVersion} */
	const documentVersionBody = validateDocumentVersionBody(request.body);

	const document = await fetchDocumentByGuidAndCaseId(guid, +caseId);

	if (documentVersionBody.documentName) {
		await documentRepository.update(document.guid, {
			name: documentVersionBody.documentName
		});

		delete documentVersionBody.documentName;
	}

	const documentDetails = await upsertDocumentVersionAndReturnDetails(
		document.guid,
		documentVersionBody
	);

	response.status(200).send(documentDetails);
};
