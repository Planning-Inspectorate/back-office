import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateSearchTerm = createValidator(
	body('searchTerm')
		.optional()
		.trim()
		.notEmpty()
		.withMessage('Search term (name or email address) must be provided')
		.bail()
		.isLength({ min: 2, max: 80 })
		.withMessage('Search term must be between 2 and 80 characters in length'),
	body('assignee').optional().notEmpty().withMessage('Something went wrong')
);
