import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateSearchApplicationsTerm = createValidator(
	body('query')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a search term')
		.isLength({ max: 500 })
		.withMessage('Search term must be 500 characters or fewer')
);
