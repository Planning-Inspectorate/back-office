import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsCreateName = createValidator(
	body('applicationName').trim().isLength({ min: 1 }).withMessage('Enter a name')
);

export const validateApplicationsCreateDescription = createValidator(
	body('applicationDescription').trim().isLength({ min: 1 }).withMessage('Enter a description')
);

export const validateApplicationsCreateSector = createValidator(
	body('sector').trim().isLength({ min: 1 }).withMessage('Select a sector')
);
