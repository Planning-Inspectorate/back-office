import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import joi from 'joi';
import { isArray, isEmpty } from 'lodash-es';
import { validationErrorHandler } from '../../../middleware/error-handler.js';
import * as DocumentRepository from '../../../repositories/document.repository.js';
import * as DocumentVersionRepository from '../../../repositories/document-metadata.repository.js';
import BackOfficeAppError from '../../../utils/app-error.js';
import {
	originEnum,
	publishedStatusEnum,
	redactedStatusEnum,
	securityClassificationEnum,
	sourceSystemEnum
} from '../../../utils/create-enums.js';
import logger from '../../../utils/logger.js';

/** @typedef {{ guid: string}} documentGuid */

/**
 * @typedef {import('apps/api/prisma/schema.js').DocumentVersion} DocumentVersion
 */

/**
 *
 * @param {Object<any, string>} errors
 * @param {string | number | object[] | undefined | null} field
 * @param {string} fieldName
 * @returns {void}
 */
const addErrorIfMissing = (errors, field, fieldName) => {
	if (field === null || typeof field === 'undefined' || (isArray(field) && isEmpty(field))) {
		errors[fieldName] = `Missing ${fieldName}`;
	}
};

export const getRedactionStatus = (/** @type {boolean} */ redactedStatus) => {
	return redactedStatus ? 'redacted' : 'not_redacted';
};

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
			`document not found: guid ${guid} related to caseId ${caseId}`,
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
 * @param {DocumentVersion} documentVersonEventBody - the event body for document metadata to validate
 * @returns {DocumentVersion} - the validated document metadata event body
 */
export const validateDocumentVersionMetadataBody = (documentVersonEventBody) => {
	// Define the schema for the document version
	const documentVersionSchema = joi.object({
		version: joi.number().positive().optional(),
		dateCreated: joi.date().iso().optional(),
		datePublished: joi.date().iso().optional(),
		lastModified: joi.date().iso().optional(),
		documentType: joi.string().allow(null).optional(),
		documentName: joi.string().optional(),
		fileName: joi.string().optional(),
		documentId: joi.string().optional(),
		sourceSystem: joi
			.string()
			.valid(...sourceSystemEnum.values())
			.optional(),
		origin: joi
			.string()
			.valid(...originEnum.values())
			.optional(),
		representative: joi.string().allow('').optional(),
		description: joi.string().optional(),
		documentGuid: joi.string().optional(),
		owner: joi.string().optional(),
		author: joi.string().optional(),
		securityClassification: joi
			.string()
			.valid(...securityClassificationEnum.values())
			.optional(),
		mime: joi.string().optional(),
		horizonDataID: joi.string().optional(),
		fileMD5: joi.string().optional(),
		path: joi.string().optional(),
		size: joi.number().optional(),
		redactedStatus: joi
			.string()
			.valid(...redactedStatusEnum.values())
			.optional(),
		publishedStatus: joi
			.string()
			.valid(...publishedStatusEnum.values())
			.optional(),
		filter1: joi.string().optional(),
		filter2: joi.string().optional(),
		examinationRefNo: joi.string().optional()
	});

	// Validate the document version event body using the schema
	const { error } = documentVersionSchema.validate(documentVersonEventBody, {
		abortEarly: false
	});

	// If there was an error, throw an exception with a message
	if (error) {
		const errorMessage = error?.message || 'there was an error validating request body';

		logger.error(`[validateDocumentVersionMetadataBody] ${errorMessage}`);
		throw new BackOfficeAppError(errorMessage, 400);
	}

	// If there were no errors, log a message and return the validated document version event body
	logger.info(
		'[validateDocumentVersionMetadataBody] Successfully validated document version event body'
	);
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

/**
 * verifies the required properties to be able to publish a doc
 * returning the errors or {}
 *
 * @param {import('@prisma/client').Document} document
 * @param {import('@prisma/client').DocumentVersion} documentVersion
 * @throws {Error}
 * @returns {Promise<Error>}
 */
const verifyDocumentPropertiesForReadyToPublish = async (document, documentVersion) => {
	const errors = {};

	// Step 4: Map the document metadata to a format to be returned in the API response.
	addErrorIfMissing(errors, document.name, 'name');
	addErrorIfMissing(errors, documentVersion.filter1, 'filter1');
	addErrorIfMissing(errors, documentVersion.description, 'description');
	addErrorIfMissing(errors, documentVersion.author, 'author');

	/* @type Promise<Error> */
	const response = new Promise((resolve) => {
		resolve(errors || {});
	});

	return response;
};

/**
 * Verifies if the given array of document GUIDs have the correct meta set, so that they are ready to publish
 *
 * @param {documentGuid[]} items
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const verifyMovingToReadyToPublish = async (items) => {
	const allErrors = [];

	if (items) {
		for (const documentItem of items) {
			const document = await DocumentRepository.getByDocumentGUID(documentItem.guid);

			if (document === null || typeof document === 'undefined') {
				// throw new Error(`Unknown document guid ${document.guid}`);
				allErrors.push({ guid: documentItem.guid, errors: 'Unknown document guid' });
			} else {
				const documentVersion = await DocumentVersionRepository.getById(documentItem.guid);

				// If the document metadata is not found, throw an error.
				if (documentVersion === null || typeof documentVersion === 'undefined') {
					allErrors.push({ guid: documentItem.guid, errors: 'Unknown document metadata guid' });
				} else {
					// check all required fields are populated:
					const errors = await verifyDocumentPropertiesForReadyToPublish(document, documentVersion);

					if (!isEmpty(errors)) {
						allErrors.push({ guid: documentItem.guid });
					}
				}
			}
		}
	}
	if (allErrors.length > 0) {
		throw new Error(JSON.stringify(allErrors));
	}
};
