import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsProjectTeamNotEmptySearch = createValidator(
	body('query').trim().isLength({ min: 1 }).withMessage('Enter a search term')
);

export const validateApplicationsProjectTeamMinLengthSearch = createValidator(
	body('query')
		.trim()
		.isLength({ min: 2 })
		.withMessage('The search term must be at least 2 characters long')
);

export const validateApplicationsProjectTeamRole = createValidator(
	body('role').trim().isLength({ min: 1 }).withMessage('You must select a role')
);
