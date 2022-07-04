import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsCreateName = createValidator(
	body('applicationName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the name')
		.isLength({ max: 500 })
		.withMessage('Name must be 500 characters or fewer')
);

export const validateApplicationsCreateDescription = createValidator(
	body('applicationDescription')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the description')
		.isLength({ max: 500 })
		.withMessage('Description must be 500 characters or fewer')
);

export const validateApplicationsCreateSector = createValidator(
	body('selectedSectorName').trim().isLength({ min: 1 }).withMessage('Select a sector')
);

export const validateApplicationsCreateSubSector = createValidator(
	body('selectedSubSectorName').trim().isLength({ min: 1 }).withMessage('Select a subsector')
);
