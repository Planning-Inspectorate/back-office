import { composeMiddleware } from '@pins/express';
import { body, param } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import * as FolderRepository from '#repositories/folder.repository.js';

/**
 *
 * @param {number} value
 * @param {{req: any}} requestInfo
 */
const validateExistingFolderBelongsToCase = async (value, { req }) => {
	const folder = await FolderRepository.getById(value);

	if (folder === null || typeof folder === 'undefined') {
		throw new Error('Unknown Folder Id');
	}

	if (folder.caseId !== Number.parseInt(req.params.id, 10)) {
		throw new Error('Must be existing folder that belongs to this case');
	}
};

export const validateFolderId = composeMiddleware(
	param('folderId')
		.isInt()
		.toInt()
		.withMessage('Folder id must be a valid numerical value')
		.custom(validateExistingFolderBelongsToCase)
		.withMessage('Must be an existing folder that belongs to this case'),
	validationErrorHandler
);

export const validateFolderDocumentsSortBy = composeMiddleware(
	param('sortBy')
		.isIn([
			'redactedStatus',
			'-redactedStatus',
			'fileName',
			'-fileName',
			'dateCreated',
			'-dateCreated',
			'publishedStatus',
			'-publishedStatus'
		])
		.withMessage(
			'Sort by must be either redactedStatus, -redactedStatus, fileName, -fileName, dateCreated, -dateCreated, publishedStatus, -publishedStatus'
		)
);

export const validateCreateBody = composeMiddleware(
	body('name').exists().withMessage('Folder must have a name'),
	body('parentFolderId')
		.toInt()
		.isInt()
		.withMessage('parentFolderId must be a valid folder ID')
		.optional({ nullable: true })
);
