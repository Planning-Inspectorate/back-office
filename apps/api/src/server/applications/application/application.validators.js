import { composeMiddleware } from '@pins/express';
import { validateFutureDate, validatePastDate } from '@pins/platform';
import { body, param } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import * as caseRepository from '../../repositories/case.repository.js';
import * as serviceCustomerRepository from '../../repositories/service-customer.repository.js';
import * as subSectorRepository from '../../repositories/sub-sector.repository.js';

/**
 *
 * @param {string} value
 */
const validateExistingSubsector = async (value) => {
	const subSector = await subSectorRepository.getByName(value);

	if (subSector === null) {
		throw new Error('Unknown Sub-Sector');
	}
};

/**
 *
 * @param {number} caseId
 */
const validateExistingApplication = async (caseId) => {
	const application = await caseRepository.getById(caseId);

	if (application === null) {
		throw new Error('Unknown Application');
	}
};

/**
 *
 * @param {number} value
 * @param {{req: any}} requestInfo
 */
const validateExistingApplicantThatBelongsToCase = async (value, { req }) => {
	const applicant = await serviceCustomerRepository.getById(value);

	if (applicant === null) {
		throw new Error('Unknown Applicant');
	}

	if (applicant.caseId !== Number.parseInt(req.params.id, 10)) {
		throw new Error('Applicant does not belong to case');
	}
};

/**
 *
 * @param {number} value
 * @returns {Date}
 */
const timestampToDate = (value) => {
	return new Date(value);
};

export const validateCreateUpdateApplication = composeMiddleware(
	body('geographicalInformation.gridReference.easting')
		.isLength({ min: 6, max: 6 })
		.toInt()
		.withMessage('Easting must be integer with 6 digits')
		.optional({ nullable: true }),
	body('geographicalInformation.gridReference.northing')
		.isLength({ min: 6, max: 6 })
		.toInt()
		.withMessage('Northing must be integer with 6 digits')
		.optional({ nullable: true }),
	// TODO: add validation once we have map zoom levels in a table
	// body('geographicalInformation.mapZoomLevel').withMessage('Must be a valid map zoom level').optional({nullable: true}),
	body('applicant.email')
		.isEmail()
		.withMessage('Email must be a valid email')
		.optional({ nullable: true }),
	body('applicant.phoneNumber')
		.matches('^0\\d{10}$')
		.withMessage('Phone Number must be a valid UK number')
		.optional({ nullable: true }),
	body('applicant.address.postcode')
		.isPostalCode('GB')
		.withMessage('Postcode must be a valid UK postcode')
		.optional({ nullable: true }),
	body('applicant.website')
		.isURL()
		.withMessage('Website must be a valid website')
		.optional({ nullable: true }),
	body('keyDates.firstNotifiedDate')
		.customSanitizer(timestampToDate)
		.custom(validatePastDate)
		.withMessage('First notified date must be in the past')
		.optional({ nullable: true }),
	body('keyDates.submissionDate')
		.customSanitizer(timestampToDate)
		.custom(validateFutureDate)
		.withMessage('Submission date must be in the future')
		.optional({ nullable: true }),
	body('subSectorName')
		.custom(validateExistingSubsector)
		.withMessage('Must be existing sub-sector')
		.optional({ nullable: true }),
	validationErrorHandler
);

export const validateApplicationId = composeMiddleware(
	param('id')
		.toInt()
		.custom(validateExistingApplication)
		.withMessage('Must be existing application'),
	validationErrorHandler
);

export const validateApplicantId = composeMiddleware(
	body('applicant.id')
		.toInt()
		.custom(validateExistingApplicantThatBelongsToCase)
		.withMessage('Must be existing applicant that belongs to this case')
		.optional({ nullable: true }),
	validationErrorHandler
);
