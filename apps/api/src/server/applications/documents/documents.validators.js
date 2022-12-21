import { composeMiddleware } from '@pins/express';
import { body, param } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';

/**
 * @param {number} value
 * @param {import('express-validator').Meta} meta
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
 * @param {string} value
 * @param {import('express-validator').Meta} meta
 */
const validateDocumentGUIDBelongsToCase = async (value, { req }) => {
	const documentGUID = await documentRepository.getByDocumentGUID(value);

	if (documentGUID === null || typeof documentGUID === 'undefined') {
		throw new Error('DocumentGUID must exist in database');
	}

	const folder = await folderRepository.getById(documentGUID?.folderId);

	const caseId = folder?.caseId;

	if (Number.parseInt(req.params?.caseId, 10) !== caseId) {
		throw new Error('GUID must belong to correct case');
	}
};

export const validateDocumentsToUploadProvided = composeMiddleware(
	body('[]').notEmpty().withMessage('Must provide documents to upload'),
	body('*.documentName').exists().withMessage('Must provide a document name'),
	body('*.folderId').exists().withMessage('Must provide a folder id'),
	validationErrorHandler
);

export const validateFolderIds = composeMiddleware(
	body('*.folderId')
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
