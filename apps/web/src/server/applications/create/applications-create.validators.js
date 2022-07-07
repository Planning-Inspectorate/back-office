import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsCreateName = createValidator(
	body('applicationName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the name of the project')
		.isLength({ max: 500 })
		.withMessage('The name must be 500 characters or fewer')
);

export const validateApplicationsCreateDescription = createValidator(
	body('applicationDescription')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the description of the project')
		.isLength({ max: 500 })
		.withMessage('The description of the project must be 500 characters or fewer')
);

export const validateApplicationsCreateSector = createValidator(
	body('selectedSectorName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Choose the sector of the project')
);

export const validateApplicationsCreateSubSector = createValidator(
	body('selectedSubSectorName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Choose the subsector of the project')
);

export const validateApplicationsCreateRegions = createValidator(
	body('selectedRegionsNames').isArray({ min: 1 }).withMessage('Choose one or multiple regions')
);

export const validateApplicationsCreateLocation = createValidator(
	body('applicationLocation')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the Case location')
		.isLength({ max: 500 })
		.withMessage('The Case location must be 500 characters or fewer')
);

export const validateApplicationsCreateEasting = createValidator(
	body('applicationEasting')
		.trim()
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter the Grid reference Easting')
);

export const validateApplicationsCreateNorthing = createValidator(
	body('applicationNorthing')
		.trim()
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter the Grid reference Easting')
);

export const validateApplicationsTeamEmail = createValidator(
	body('applicationTeamEmail')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the case team email address')
		.isEmail()
		.withMessage('Enter a valid email address')
);
