import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { getErrorMessageCaseCreate } from '../applications-create.service.js';

export const validateApplicationsCreateCaseName = createValidator(
	body('title')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter project name')
		.isLength({ max: 500 })
		.withMessage('The name must be 500 characters or fewer')
);

export const validateApplicationsCreateCaseNameWelsh = createValidator(
	body('titleWelsh')
		.if(body('titleWelsh').exists())
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter project name in Welsh')
		.isLength({ max: 500 })
		.withMessage('The name must be 500 characters or fewer')
);

export const validateApplicationsCreateCaseDescription = createValidator(
	body('description')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter project description')
		.isLength({ max: 2000 })
		.withMessage('Project description must be 2000 characters or less')
);

export const validateApplicationsCreateCaseDescriptionWelsh = createValidator(
	body('descriptionWelsh')
		.if(body('descriptionWelsh').exists())
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter project description in Welsh')
		.isLength({ max: 2000 })
		.withMessage('Project description in Welsh must be 2000 characters or less')
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
		.isLength({ max: 2000 })
		.withMessage('Project location must be 2000 characters or less')
);

export const validateApplicationsCreateCaseLocationWelsh = createValidator(
	body('geographicalInformation.locationDescriptionWelsh')
		.if(body('geographicalInformation.locationDescriptionWelsh').exists())
		.trim()
		.isLength({ min: 1 })
		.withMessage(getErrorMessageCaseCreate('projectLocationWelsh'))
		.isLength({ max: 2000 })
		.withMessage('Project location in Welsh must be 2000 characters or less')
);

export const validateApplicationsCreateCaseEasting = createValidator(
	body('geographicalInformation.gridReference.easting')
		.trim()
		.isLength({ min: 1 })
		.withMessage(getErrorMessageCaseCreate('gridReferenceEasting'))
		.isNumeric()
		.withMessage('Enter 6 digits for the Grid reference Easting')
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter 6 digits for the Grid reference Easting')
);

export const validateApplicationsCreateCaseNorthing = createValidator(
	body('geographicalInformation.gridReference.northing')
		.trim()
		.isLength({ min: 1 })
		.withMessage(getErrorMessageCaseCreate('gridReferenceNorthing'))
		.isNumeric()
		.withMessage('Enter 6 digits for the Grid reference Northing')
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

export const validateApplicationsCreateCaseStage = createValidator(
	body('stage')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Set a stage for the case')
		.isLength({ max: 50 })
		.withMessage('The case stage must be 50 characters or fewer')
);

export const validateApplicationsCreateCaseOrganisationName = createValidator(
	body('organisationName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter the Applicant’s organisation to publish the project')
);
