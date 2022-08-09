import { composeMiddleware } from '@pins/express';
import { validateFutureDate } from '@pins/platform';
import { body, param } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import * as caseRepository from '../../repositories/case.repository.js';
import * as regionRepository from '../../repositories/region.repository.js';
import * as serviceCustomerRepository from '../../repositories/service-customer.repository.js';
import * as subSectorRepository from '../../repositories/sub-sector.repository.js';
import * as zoomLevelRepository from '../../repositories/zoom-level.repository.js';

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
 * @param {string[]} value
 */
const validateExistingRegions = async (value) => {
	for (const regionName of value) {
		const region = await regionRepository.getByName(regionName);

		if (region === null) {
			throw new Error('Unknown region');
		}
	}
};

/** @type {import('express').RequestHandler } */
export const validateExistingApplication = async (request, response, next) => {
	const caseId = Number.parseInt(request.params.id, 10);

	const application = await caseRepository.getById(caseId, {});

	if (!application) {
		return response.status(404).send({
			errors: {
				status: 'Application not found'
			}
		});
	}
	next();
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
 * @param {string} value
 */
const validateExistingMapZoomLevel = async (value) => {
	const mapZoomLevel = await zoomLevelRepository.getByName(value);

	if (mapZoomLevel == null) {
		throw new Error('Unknown map zoom level');
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
		.toInt()
		.isLength({ min: 6, max: 6 })
		.withMessage('Easting must be integer with 6 digits')
		.optional({ nullable: true }),
	body('geographicalInformation.gridReference.northing')
		.toInt()
		.isLength({ min: 6, max: 6 })
		.withMessage('Northing must be integer with 6 digits')
		.optional({ nullable: true }),
	body('geographicalInformation.mapZoomLevelName')
		.custom(validateExistingMapZoomLevel)
		.withMessage('Must be a valid map zoom level')
		.optional({ nullable: true }),
	body('geographicalInformation.regionNames')
		.isArray()
		.custom(validateExistingRegions)
		.optional({ nullable: true }),
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
	body('keyDates.submissionDateInternal')
		.customSanitizer(timestampToDate)
		.custom(validateFutureDate)
		.withMessage('Submission date internal must be in the future')
		.optional({ nullable: true }),
	body('subSectorName')
		.custom(validateExistingSubsector)
		.withMessage('Must be existing sub-sector')
		.optional({ nullable: true }),
	body('caseEmail')
		.isEmail()
		.withMessage('Case email must be a valid email address')
		.optional({ nullable: true }),
	validationErrorHandler
);

export const validateApplicationId = composeMiddleware(
	param('id').toInt().isInt().withMessage('Application id must be a valid numerical value'),
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
