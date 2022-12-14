import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../../middleware/error-handler.js';
import * as DocumentRepository from '../../../repositories/document.repository.js';

/** @typedef {{ guid: string}} documentGuid */

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
					throw new Error(`Unknown Document Guid ${documentGuid.guid}`);
				}
			} catch {
				throw new Error(`Unknown Document Guid ${documentGuid.guid}`);
			}
		}
	} else {
		throw new Error('No document Guids specified');
	}
};

export const validateDocumentsToUploadProvided = composeMiddleware(
	body('[]').notEmpty().withMessage('Must provide documents to upload'),
	body('*.documentName').exists().withMessage('Must provide a document name'),
	body('*.folderId').exists().withMessage('Must provide a folder id'),
	validationErrorHandler
);

export const validateDocumentsToUpdateProvided = composeMiddleware(
	body('[]').notEmpty().withMessage('Must provide documents to update'),
	validationErrorHandler
);

export const validateDocumentIds = composeMiddleware(
	body('[].items').custom(validateAllDocumentsExist).withMessage('Document Guid not found'),
	validationErrorHandler
);
