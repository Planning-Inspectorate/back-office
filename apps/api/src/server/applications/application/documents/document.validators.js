import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../../middleware/error-handler.js';
import * as DocumentRepository from '../../../repositories/document.repository.js';
import BackOfficeAppError from '../../../utils/app-error.js';

/** @typedef {{ guid: string}} documentGuid */

/**
 * Fetch the document by its `guid` and related to a `caseId`.
 *
 * @function
 * @async
 * @param {string} guid - The document's globally unique identifier.
 * @param {number} caseId - The case's identifier the document is related to.
 * @throws {BackOfficeAppError} - If the document is not found with the specified `guid` and related to the specified `caseId`.
 * @returns {Promise<{blobStorageContainer?: string; blobStoragePath?: string;status?: string;}>} - The document object with properties `blobStorageContainer`, `blobStoragePath`, and `status`.
 */
export const fetchDocumentByGuidAndCaseId = async (
	/** @type {string} */ guid,
	/** @type {number} */ caseId
) => {
	const /** @type {import('apps/api/prisma/schema.js').Document | null} */ document =
			await DocumentRepository.getByIdRelatedToCaseId(guid, caseId);

	if (document === null || typeof document === 'undefined') {
		throw new BackOfficeAppError(
			`document not found guid ${guid} related to casedId ${caseId}`,
			404
		);
	}

	return {
		blobStorageContainer: document?.blobStorageContainer,
		blobStoragePath: document?.blobStoragePath,
		status: document?.status
	};
};

/**
 * Validate that an array of document exists
 *
 * @param {documentGuid[]} documentGuids
 */
const validateAllDocumentsExist = async (documentGuids) => {
	if (documentGuids) {
		for (const documentGuid of documentGuids) {
			try {
				const document = await DocumentRepository.getById(documentGuid.guid);

				if (document === null || typeof document === 'undefined') {
					throw new Error(`Unknown document guid ${documentGuid.guid}`);
				}
			} catch {
				throw new Error(`Unknown document guid ${documentGuid.guid}`);
			}
		}
	} else {
		throw new Error('No document guids specified');
	}
};

export const validateDocumentsToUploadProvided = composeMiddleware(
	body('[]').notEmpty().withMessage('Must provide documents to upload'),
	body('*.documentName').exists().withMessage('Must provide a document name'),
	body('*.documentType').exists().withMessage('Must provide a document type'),
	body('*.documentSize').exists().withMessage('Must provide a document size'),
	body('*.folderId').exists().withMessage('Must provide a folder id'),
	validationErrorHandler
);

export const validateDocumentsToUpdateProvided = composeMiddleware(
	body('[]').notEmpty().withMessage('Must provide documents to update'),
	validationErrorHandler
);

export const validateDocumentIds = composeMiddleware(
	body('[].items').custom(validateAllDocumentsExist),
	validationErrorHandler
);
