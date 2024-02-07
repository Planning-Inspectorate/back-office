import { composeMiddleware } from '@pins/express';
import { validateFutureDate } from '@pins/platform';
import { body, param, query } from 'express-validator';
import {
	validationErrorHandler,
	validationErrorHandlerMissing
} from '#middleware/error-handler.js';
import * as caseRepository from '#repositories/case.repository.js';
import * as regionRepository from '#repositories/region.repository.js';
import * as representationRepository from '#repositories/representation.repository.js';
import * as subSectorRepository from '#repositories/sub-sector.repository.js';
import * as zoomLevelRepository from '#repositories/zoom-level.repository.js';

/**
 *
 * @param {string} value
 * @throws {Error}
 * @returns {Promise<void>}
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
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateExistingRegions = async (value) => {
	for (const regionName of value) {
		const region = await regionRepository.getByName(regionName);

		if (region === null) {
			throw new Error('Unknown region');
		}
	}
};

/**
 *
 * @param {number} value
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const validateExistingApplication = async (value) => {
	const caseFromDatabase = await caseRepository.getById(value, {});

	if (caseFromDatabase === null || typeof caseFromDatabase === 'undefined') {
		throw new Error(`unknown case with id ${value}`);
	}
};

/**
 *
 * @param {number} value
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateExistingRepresentation = async (value) => {
	const representation = await representationRepository.getById(value);

	if (representation === null || typeof representation === 'undefined') {
		throw new Error('Unknown representation');
	}
};

/**
 *
 * @param {number} value
 * @param {{req: any}} requestInfo
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateExistingApplicantThatBelongsToCase = async (value, { req }) => {
	const caseDetails = await caseRepository.getById(Number(req.params.id), { applicant: true });

	if (caseDetails?.applicant?.id !== value) {
		throw new Error('Must be existing applicant that belongs to this case');
	}
};

/**
 *
 * @param {string} value
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateExistingMapZoomLevel = async (value) => {
	const mapZoomLevel = await zoomLevelRepository.getByName(value);

	if (mapZoomLevel == null) {
		throw new Error('Unknown map zoom level');
	}
};

/**
 *
 * @param {string} value
 * */
export const validateCaseStage = async (value) => {
	const isValid = [
		'pre_application',
		'draft',
		'acceptance',
		'pre_examination',
		'examination',
		'recommendation',
		'decision',
		'post_decision',
		'withdrawn'
	].includes(value);

	if (!isValid) {
		throw new Error(`'${value}' is not a valid case stage`);
	}
};

/**
 *
 * @param {number} value
 * @returns {Date}
 */
const timestampToDate = (value) => {
	return new Date(value * 1000);
};

export const validateCreateUpdateApplication = composeMiddleware(
	body('title').optional({ nullable: true }),
	body('description').optional({ nullable: true }),
	body('subSectorName')
		.custom(validateExistingSubsector)
		.withMessage('Must be existing sub-sector')
		.optional({ nullable: true }),
	body('caseEmail')
		.isEmail({
			allow_display_name: false,
			require_tld: true,
			allow_ip_domain: false
		})
		.withMessage('Case email must be a valid email address')
		.optional({ nullable: true, checkFalsy: true }),
	body('stage')
		.custom(validateCaseStage)
		.withMessage('Must be a valid case stage')
		.optional({ nullable: true }),
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
	body('geographicalInformation.locationDescription').optional({ nullable: true }),
	body('applicant.organisationName').optional({ nullable: true }),
	body('applicant.firstName').optional({ nullable: true }),
	body('applicant.middleName').optional({ nullable: true }),
	body('applicant.lastName').optional({ nullable: true }),
	body('applicant.email')
		.isEmail({
			allow_display_name: false,
			require_tld: true,
			allow_ip_domain: false
		})
		.withMessage('Email must be a valid email')
		.optional({ nullable: true, checkFalsy: true }),
	// regex check added to website, to exclude @ signs, which for some reason are valid in isUrl
	body('applicant.website')
		.trim()
		.matches(/^[^@]*$/)
		.withMessage('Website must be a valid website')
		.isURL({
			require_tld: true,
			require_port: false,
			allow_trailing_dot: false,
			allow_protocol_relative_urls: false,
			allow_query_components: false,
			allow_fragments: false
		})
		.withMessage('Website must be a valid website')
		.optional({ nullable: true, checkFalsy: true }),
	body('applicant.phoneNumber')
		.trim()
		.matches(/^\+?(?:\d\s?){10,12}$/)
		.withMessage('Phone Number must be a valid UK number')
		.optional({ nullable: true, checkFalsy: true }),
	body('applicant.address.addressLine1').optional({ nullable: true }),
	body('applicant.address.addressLine2').optional({ nullable: true }),
	body('applicant.address.town').optional({ nullable: true }),
	body('applicant.address.county').optional({ nullable: true }),
	body('applicant.address.postcode')
		.isPostalCode('GB')
		.withMessage('Postcode must be a valid UK postcode')
		.optional({ nullable: true }),
	body('keyDates.preApplication.submissionAtPublished').optional({ nullable: true }),
	body('keyDates.preApplication.submissionAtInternal')
		.customSanitizer(timestampToDate)
		.custom(validateFutureDate)
		.withMessage('Submission date internal must be in the future')
		.optional({ nullable: true }),
	validationErrorHandler
);

export const validateApplicationId = composeMiddleware(
	param('id')
		.toInt()
		.isInt()
		.withMessage('Application id must be a valid numerical value')
		.custom(validateExistingApplication)
		.withMessage('Must be an existing application'),
	validationErrorHandlerMissing
);

export const validateDocumentGuid = composeMiddleware(
	param('guid')
		.isString()
		.withMessage('Document GUID must be a valid GUID')
		.custom(validateExistingApplication)
		.withMessage('Must be an existing application'),
	validationErrorHandlerMissing
);

export const validateApplicantId = composeMiddleware(
	body('applicant.id')
		.toInt()
		.custom(validateExistingApplicantThatBelongsToCase)
		.withMessage('Must be existing applicant that belongs to this case')
		.optional({ nullable: true }),
	validationErrorHandler
);

export const validateGetApplicationQuery = composeMiddleware(
	query('query').optional({ nullable: true }),
	validationErrorHandler
);

export const validateGetRepresentationsQuery = composeMiddleware(
	query('page')
		.toInt()
		.isInt({
			min: 1
		})
		.optional({ nullable: true }),
	query('pageSize')
		.toInt()
		.isInt({
			max: 100,
			min: 1
		})
		.optional({ nullable: true }),
	query('searchTerm').optional({ nullable: true }),
	query('status').optional({ nullable: true }),
	query('under18').optional({ nullable: true }),
	validationErrorHandler
);

export const validateGetRepresentationQuery = composeMiddleware(
	query('page')
		.toInt()
		.isInt({
			min: 1
		})
		.optional({ nullable: true }),
	query('page')
		.toInt()
		.isInt({
			min: 1
		})
		.optional({ nullable: true }),
	validationErrorHandler
);

export const validateRepresentationId = composeMiddleware(
	param('repId')
		.toInt()
		.isInt()
		.withMessage('Representation id must be a valid numerical value')
		.custom(validateExistingRepresentation)
		.withMessage('Must be an existing representation'),
	validationErrorHandlerMissing
);

export const validateCreateRepresentation = composeMiddleware(
	body('represented.firstName')
		.exists({ checkFalsy: true, checkNull: true })
		.isLength({ min: 1, max: 64 }),
	body('represented.lastName').exists(),
	validationErrorHandler
);

/**
 * Ensures the project in question is not a training project.
 * Most of the time, multiple checks will be redundant, but we need to be as sure as possible that we're not emitting events for training projects.
 *
 * @param {number} caseId
 * @throws {Error}
 * */
export const verifyNotTraining = async (caseId) => {
	const projectWithSector = await caseRepository.getById(caseId, { sector: true });
	if (!projectWithSector) {
		throw new Error(`Could not find case with ID ${caseId}.`);
	}

	const noFieldsToTest = !(
		projectWithSector.reference || projectWithSector.ApplicationDetails?.subSector?.sector?.name
	);
	if (noFieldsToTest) {
		throw new Error(
			`Could not verify case with ID ${caseId} is not a training case. It does not have a sector or reference to test.`
		);
	}

	const isTraining =
		/^TRAIN/.test(projectWithSector.reference ?? '') ||
		projectWithSector.ApplicationDetails?.subSector?.sector?.name === 'training';
	if (isTraining) {
		throw new Error(`Case with ID ${caseId} is a training case.`);
	}
};

/**
 * Is this is a "Training" case? - checks the reference name and/or the sector name, rather than querying DB
 *
 * @param {string |undefined} reference
 * @param {string |undefined} sector
 * @returns
 */
export const isTrainingCase = (reference, sector) => {
	return /^TRAIN/.test(reference ?? '') || (sector ?? '') === 'training';
};
