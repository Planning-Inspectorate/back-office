import { composeMiddleware } from '@pins/express';
import { body, param } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';

/**
 * Validates that a folder with the given ID belongs to the case specified in the request parameters.
 *
 * @param {number} value
 * @param {import('express-validator').Meta} meta
 * @throws {Error} Throws an error if the folder does not exist in the database or if it does not belong to the case in the request parameters.
 */
const validateFolderBelongsToCase = async (value, { req }) => {
	const folder = await folderRepository.getById(value);

	if (folder === null || typeof folder === 'undefined') {
		throw new Error('Folder must exist in database');
	}

	if (folder.caseId !== req.params?.id) {
		throw new Error('Folder does not belong to case');
	}
};

/**
 * Validates if the given document GUID exists in the database.
 *
 * @param {string} value
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateDocumentGUIDBelongsToCase = async (value) => {
	const documentGUID = await documentRepository.getByDocumentGUID(value);

	if (documentGUID === null || typeof documentGUID === 'undefined') {
		throw new Error('DocumentGUID must exist in database');
	}
};

export const validateDocumentsToUploadProvided = composeMiddleware(
	body('[]').notEmpty().withMessage('Must provide documents to upload'),
	body('*.documentName').exists().withMessage('Must provide a document name'),
	body('*.folderId').exists().withMessage('Must provide a folder id'),
	body('*.documentSize').exists().withMessage('Must provide a document size'),
	body('*.documentType').exists().withMessage('Must provide a document type'),
	validationErrorHandler
);

export const validateFolderIds = composeMiddleware(
	body('*.folderId')
		.toInt()
		.custom(validateFolderBelongsToCase)
		.withMessage('Folder must belong to case'),
	validationErrorHandler
);

export const validateFolderId = composeMiddleware(
	body('.folderId')
		.toInt()
		.custom(validateFolderBelongsToCase)
		.withMessage('Folder must belong to case'),
	validationErrorHandler
);

export const validateDocumentGUID = composeMiddleware(
	param('documentGUID')
		.custom(validateDocumentGUIDBelongsToCase)
		.withMessage('GUID must belong to correct case'),
	validationErrorHandler
);

export const validateMachineAction = composeMiddleware(
	body('machineAction').exists().withMessage('Please provide a value for machine action'),
	validationErrorHandler
);
