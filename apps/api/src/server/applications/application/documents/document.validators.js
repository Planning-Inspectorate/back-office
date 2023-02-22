import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import joi from 'joi';
import { validationErrorHandler } from '../../../middleware/error-handler.js';
import * as DocumentRepository from '../../../repositories/document.repository.js';
import BackOfficeAppError from '../../../utils/app-error.js';

/** @typedef {{ guid: string}} documentGuid */

/**
 * @typedef {import('apps/api/prisma/schema.js').DocumentVersion} DocumentVersion
 */

/**
 * Fetch the document by its `guid` and related to a `caseId`.
 *
 * @function
 * @async
 * @param {string} guid - The document's globally unique identifier.
 * @param {number} caseId - The case's identifier the document is related to.
 * @throws {BackOfficeAppError} - If the document is not found with the specified `guid` and related to the specified `caseId`.
 * @returns {Promise<{blobStorageContainer?: string; blobStoragePath?: string;status?: string; guid: string;}>} - The document object with properties `blobStorageContainer`, `blobStoragePath`, and `status`.
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
		blobStorageContainer: document?.blobStorageContainer || '',
		blobStoragePath: document?.blobStoragePath || '',
		status: document?.status,
		guid: document.guid
	};
};

/**
 * Validates that the event body for document metadata exists based on the provided DocumentVersion schema.
 *
 * @param {DocumentVersion} documentVersonEventBody
 * @returns {DocumentVersion}
 */

export const validateDocumentVersionBody = (documentVersonEventBody) => {
	const documentVersionSchema = joi.object({
		version: joi.number().positive().optional(),
		receivedDate: joi.date().iso().optional(),
		publishedDate: joi.date().iso().optional(),
		lastModified: joi.date().iso().optional(),
		documentType: joi.string().optional(),
		documentName: joi.string().optional(),
		fileName: joi.string().optional(),
		documentId: joi.string().optional(),
		published: joi.boolean().optional(),
		redacted: joi.boolean().optional(),
		sourceSystem: joi.string().optional(),
		origin: joi.string().optional(),
		representative: joi.string().optional(),
		description: joi.string().optional(),
		documentGuid: joi.string().optional(),
		owner: joi.string().optional(),
		author: joi.string().optional(),
		securityClassification: joi.string().optional(),
		mime: joi.string().optional(),
		horizonDataID: joi.string().optional(),
		fileMD5: joi.string().optional(),
		path: joi.string().optional(),
		size: joi.number().optional(),
		stage: joi.number().optional(),
		filter1: joi.string().optional(),
		filter2: joi.string().optional(),
		status: joi.string().optional(),
		examinationRefNo: joi.string().optional()
	});

	const { error } = documentVersionSchema.validate(documentVersonEventBody, {
		abortEarly: false
	});

	if (error) {
		throw new BackOfficeAppError(
			error?.message || 'there was an error validating request body',
			400
		);
	}

	return documentVersonEventBody;
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
