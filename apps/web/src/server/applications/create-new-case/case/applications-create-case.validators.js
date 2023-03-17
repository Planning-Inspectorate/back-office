import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { getErrorMessageCaseCreate } from '../applications-create.service.js';

export const validateApplicationsCreateCaseName = createValidator(
	body('title')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the name of the project')
		.isLength({ max: 500 })
		.withMessage('The name must be 500 characters or fewer')
);

export const validateApplicationsCreateCaseDescription = createValidator(
	body('description')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the description of the project')
		.isLength({ max: 500 })
		.withMessage('The description of the project must be 500 characters or fewer')
);

export const validateApplicationsCreateCaseSector = createValidator(
	body('sectorName').trim().isLength({ min: 1 }).withMessage('Choose the sector of the project')
);

export const validateApplicationsCreateCaseSubSector = createValidator(
	body('subSectorName')
		.trim()
		.isLength({ min: 1 })
		.withMessage(getErrorMessageCaseCreate('subSector'))
);

export const validateApplicationsCreateCaseRegions = createValidator(
	body('geographicalInformation.regionNames')
		.isArray({ min: 1 })
		.withMessage('Choose at least one region')
);

export const validateApplicationsCreateCaseLocation = createValidator(
	body('geographicalInformation.locationDescription')
		.trim()
		.isLength({ min: 1 })
		.withMessage(getErrorMessageCaseCreate('projectLocation'))
		.isLength({ max: 500 })
		.withMessage('The project location must be 500 characters or fewer')
);

export const validateApplicationsCreateCaseEasting = createValidator(
	body('geographicalInformation.gridReference.easting')
		.trim()
		.isLength({ min: 1 })
		.withMessage(getErrorMessageCaseCreate('gridReferenceEasting'))
		.toInt()
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter 6 digits for the Grid reference Easting')
);

export const validateApplicationsCreateCaseNorthing = createValidator(
	body('geographicalInformation.gridReference.northing')
		.trim()
		.isLength({ min: 1 })
		.withMessage(getErrorMessageCaseCreate('gridReferenceNorthing'))
		.toInt()
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter 6 digits for the Grid reference Northing')
);

export const validateApplicationsTeamEmail = createValidator(
	body('caseEmail')
		.optional({ checkFalsy: true })
		.trim()
		.isEmail({
			allow_display_name: false,
			require_tld: true,
			allow_ip_domain: false
		})
		.withMessage('Enter a valid email address')
);
