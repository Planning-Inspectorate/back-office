import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import joi from 'joi';
import { validationErrorHandler } from '#middleware/error-handler.js';
import * as DocumentRepository from '#repositories/document.repository.js';
import BackOfficeAppError from '#utils/app-error.js';
import {
	originEnum,
	publishedStatusEnum,
	redactedStatusEnum,
	securityClassificationEnum,
	sourceSystemEnum
} from '#utils/create-enums.js';
import logger from '#utils/logger.js';

/** @typedef {{ guid: string}} documentGuid */

/**
 * @typedef {import('@prisma/client').DocumentVersion} DocumentVersion
 * @typedef {import('@prisma/client').Document} Document
 * @typedef {import('@pins/applications.api').Api.DocumentVersionUpsertRequestBody} DocumentVersionUpsertRequestBody
 * @typedef {import('@pins/applications.api').Schema.DocumentVersionUpsertInput} DocumentVersionUpsertInput
 */

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
 * @returns {Promise<{privateBlobContainer?: string; privateBlobPath?: string;status?: string; guid: string;}>} - The document object with properties `privateBlobContainer`, `privateBlobPath`, and `status`.
 */
export const fetchDocumentByGuidAndCaseId = async (
	/** @type {string} */ guid,
	/** @type {number} */ caseId
) => {
	const /** @type {Document | null} */ document = await DocumentRepository.getByIdRelatedToCaseId(
			guid,
			caseId
		);

	if (document === null || typeof document === 'undefined') {
		throw new BackOfficeAppError(
			`document not found: guid ${guid} related to caseId ${caseId}`,
			404
		);
	}

	return {
		privateBlobContainer: document?.privateBlobContainer || '',
		privateBlobPath: document?.privateBlobPath || '',
		status: document?.status,
		guid: document.guid
	};
};

/**
 * Validates that the event body for document metadata exists based on the provided DocumentVersion schema.
 *
 * @param {DocumentVersionUpsertRequestBody} documentVersionEventBody - the event body for document metadata to validate
 * @returns {{ documentVersion: DocumentVersionUpsertInput, transcriptReference: string | null }} - the validated document metadata event body
 */
export const validateDocumentVersionMetadataBody = (documentVersionEventBody) => {
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
		examinationRefNo: joi.string().optional(),
		transcript: joi.string().allow('').optional()
	});

	// Validate the document version event body using the schema
	const { error } = documentVersionSchema.validate(documentVersionEventBody, {
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

	const transcriptReference = documentVersionEventBody.transcript ?? null;
	delete documentVersionEventBody.transcript;

	return {
		documentVersion: documentVersionEventBody,
		transcriptReference
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

export const validateDocumentToUploadProvided = composeMiddleware(
	body('.documentName').exists().withMessage('Must provide a document names'),
	body('.documentType').exists().withMessage('Must provide a document type'),
	body('.documentSize').exists().withMessage('Must provide a document size'),
	body('.folderId').exists().withMessage('Must provide a folder id'),
	validationErrorHandler
);

export const validateMarkDocumentAsPublished = composeMiddleware(
	body('.publishedBlobPath').exists().withMessage('Must provide a published blob path'),
	body('.publishedBlobContainer').exists().withMessage('Must provide a published blob container'),
	body('.publishedDate').exists().withMessage('Must provide a published date'),
	validationErrorHandler
);

export const validateDocumentsToUpdateProvided = composeMiddleware(
	body('[]').notEmpty().withMessage('Must provide documents to update'),
	validationErrorHandler
);

export const validateDocumentIds = composeMiddleware(
	body('[].documents').custom(validateAllDocumentsExist),
	validationErrorHandler
);

/**
 * Verifies if the given array of document GUIDs have the correct meta set, so that they are ready to publish.
 * For S51 Advice documents, skipRequiredPropertyChecks is true to skip the mandatory field checks
 *
 * @param {string[]} documentIds
 * @param {boolean} skipRequiredPropertyChecks	// true for S51 advice doc publishing
 * @typedef {{ publishable: {documentGuid: string, version: number}[], invalid: {guid: string, msg: string}[] }} VerifiedReturn
 * @returns {Promise<VerifiedReturn>}
 */
export const verifyAllDocumentsHaveRequiredPropertiesForPublishing = async (
	documentIds,
	skipRequiredPropertyChecks
) => {
	// get publishable files (ie with all mandatory metadata, or S51 advice files), (this can include MSG files)
	let completeDocuments;
	if (skipRequiredPropertyChecks) {
		completeDocuments =
			await DocumentRepository.getPublishableDocumentsWithoutRequiredPropertiesCheck(documentIds);
	} else {
		completeDocuments = await DocumentRepository.getPublishableDocuments(documentIds);
	}

	const completeDocumentsIds = new Set(completeDocuments.map((pDoc) => pDoc.guid));

	// remove email documents - never published
	const publishableDocuments = completeDocuments.filter(
		(doc) => doc.latestDocumentVersion?.mime !== 'application/vnd.ms-outlook'
	);
	const publishableDocumentsIds = new Set(publishableDocuments.map((pDoc) => pDoc.guid));

	// complete MSG files
	const msgDocuments = documentIds.filter(
		(id) => completeDocumentsIds.has(id) && !publishableDocumentsIds.has(id)
	);

	// incomplete files
	const incompleteDocuments = documentIds.filter((id) => !completeDocumentsIds.has(id));

	// Final array of invalid files
	const invalid = [
		...msgDocuments.map((id) => ({
			guid: id,
			msg: "The file type .msg cannot be set to 'Ready for publish'"
		})),
		...incompleteDocuments.map((id) => ({
			guid: id,
			msg: 'You must fill in all mandatory document properties to publish a document'
		}))
	];

	return {
		publishable: publishableDocuments.map(({ guid, latestVersionId }) => ({
			documentGuid: guid,
			version: latestVersionId
		})),
		invalid
	};
};
