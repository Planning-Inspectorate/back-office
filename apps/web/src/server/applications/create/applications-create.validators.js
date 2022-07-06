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

export const validateApplicationsCreateRegions = createValidator(
	body('selectedRegionsNames').isArray({ min: 1 }).withMessage('Choose at least one region')
);

export const validateApplicationsCreateLocation = createValidator(
	body('applicationLocation')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the location')
		.isLength({ max: 500 })
		.withMessage('Location must be 500 characters or fewer')
);

export const validateApplicationsCreateEasting = createValidator(
	body('applicationEasting')
		.trim()
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter grid reference Easting')
);

export const validateApplicationsCreateNorthing = createValidator(
	body('applicationNorthing')
		.trim()
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter grid reference Northing')
);
