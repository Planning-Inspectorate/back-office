import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsCreateCaseName = createValidator(
	body('applicationName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the name of the project')
		.isLength({ max: 500 })
		.withMessage('The name must be 500 characters or fewer')
);

export const validateApplicationsCreateCaseDescription = createValidator(
	body('applicationDescription')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the description of the project')
		.isLength({ max: 500 })
		.withMessage('The description of the project must be 500 characters or fewer')
);

export const validateApplicationsCreateCaseSector = createValidator(
	body('selectedSectorName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Choose the sector of the project')
);

export const validateApplicationsCreateCaseSubSector = createValidator(
	body('selectedSubSectorName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Choose the subsector of the project')
);

export const validateApplicationsCreateCaseRegions = createValidator(
	body('selectedRegionsNames').isArray({ min: 1 }).withMessage('Choose one or multiple regions')
);

export const validateApplicationsCreateCaseLocation = createValidator(
	body('applicationLocation')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the Case location')
		.isLength({ max: 500 })
		.withMessage('The Case location must be 500 characters or fewer')
);

export const validateApplicationsCreateCaseEasting = createValidator(
	body('applicationEasting')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the Grid reference Easting')
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter a valid Grid reference Easting')
);

export const validateApplicationsCreateCaseNorthing = createValidator(
	body('applicationNorthing')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the Grid reference Northing')
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter a valid Grid reference Northing')
);

export const validateApplicationsTeamEmail = createValidator(
	body('applicationTeamEmail')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the case team email address')
		.isEmail()
		.withMessage('Enter a valid email address')
);
