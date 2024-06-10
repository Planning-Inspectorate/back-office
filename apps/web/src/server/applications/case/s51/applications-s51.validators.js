import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	validationDateFuture,
	validationDateMandatory,
	validationDateValid
} from '../../common/validators/dates.validators.js';
import { getS51Advice } from './applications-s51.service.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * Dispatch the POST route to the right validator
 *
 * @type {RequestHandler}
 */
export const s51ValidatorsDispatcher = async (request, response, next) => {
	const { step } = request.params;

	/** @type {Record<string, RequestHandler>} */
	const validators = {
		title: validateS51Title,
		'title-in-welsh': validateS51TitleWelsh,
		enquirer: validateS51Enquirer,
		method: validateS51Method,
		'enquiry-date': validateS51Details('enquiry', 'enquiry details', ['date']),
		'enquiry-detail': validateS51Details('enquiry', 'enquiry details', ['details']),
		'enquiry-details': validateS51Details('enquiry', 'enquiry details', ['date', 'details']),
		'enquiry-detail-in-welsh': validateS1EnquiryDetailsWelsh,
		person: validateS51Person,
		'advice-date': validateS51Details('advice', 'advice given', ['date']),
		'advice-detail': validateS51Details('advice', 'advice given', ['details']),
		'advice-details': validateS51Details('advice', 'advice given', ['date', 'details']),
		'advice-detail-in-welsh': validateS1AdviceDetailsWelsh
	};

	if (Object.keys(validators).includes(step)) {
		const validator = validators[step];
		if (validator && typeof validator === 'function') {
			return validator(request, response, next);
		}
	}

	return next();
};

export const validateS51Title = createValidator(
	body('title')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a S51 advice title')
		.isLength({ max: 255 })
		.withMessage('The name must be 255 characters or fewer')
);

export const validateS51TitleWelsh = createValidator(
	body('titleWelsh')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the S51 title in Welsh')
		.isLength({ max: 255 })
		.withMessage('The S51 title in Welsh must be 255 characters or fewer')
);

export const validateS51Method = createValidator(
	body('enquiryMethod')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must select a method of enquiry')
);

export const validateS51Person = createValidator(
	body('adviser').trim().isLength({ min: 1 }).withMessage('You must enter a name')
);

/**
 * Check name, last name and organisation exist and are valid
 *
 * @type {RequestHandler}
 */
export const validateS51Enquirer = (request, response, next) => {
	const checkNotNull = body('all')
		.custom((_, { req }) => {
			const body = req.body;
			// input fields in the creation flow are different than updating flow
			// important to check both scenarios
			const allEmpty = !(
				!body.enquirerFirstName &&
				!body.firstName &&
				!body.enquirerLastName &&
				!body.lastName &&
				!body.enquirerOrganisation &&
				!body.enquirer
			);

			return allEmpty;
		})
		.withMessage('You must enter either a name, organisation or both');

	const checkLastNameIfFirstName = body('enquirerLastName')
		.custom((_, { req }) => {
			const body = req.body;
			const firstName = body.enquirerFirstName || body.firstName;
			const lastName = body.enquirerLastName || body.lastName;
			const lastNameNotDefined = !(!!firstName && !lastName);

			return lastNameNotDefined;
		})
		.withMessage('You must enter a last name');

	const checkFirstNameIfLastName = body('enquirerFirstName')
		.custom((_, { req }) => {
			const body = req.body;
			const firstName = body.enquirerFirstName || body.firstName;
			const lastName = body.enquirerLastName || body.lastName;
			const firstNameNotDefined = !(!firstName && !!lastName);

			return firstNameNotDefined;
		})
		.withMessage('You must enter a first name');

	return createValidator([checkNotNull, checkLastNameIfFirstName, checkFirstNameIfLastName])(
		request,
		response,
		next
	);
};

/**
 * Check date is valid and in the past and details are provided
 *
 * @param {string} fieldName
 * @param {string} extendedDetailsFieldName
 * @param {string[]} paramsToValidate
 * @returns {RequestHandler}
 */
export const validateS51Details =
	(fieldName, extendedDetailsFieldName, paramsToValidate) => (request, response, next) => {
		const dateFieldName = `${fieldName}Date`;

		const detailsFieldName = `${fieldName}Details`;

		const checkMandatoryDate = validationDateMandatory(
			{ fieldName: dateFieldName, extendedFieldName: 'date' },
			request.body
		);

		const checkValidDate = validationDateValid(
			{ fieldName: dateFieldName, extendedFieldName: 'date' },
			request.body
		);

		const checkPastDate = validationDateFuture(
			{ fieldName: dateFieldName, extendedFieldName: 'date' },
			request.body,
			false,
			false
		);

		const checkEnquiryDate = [checkMandatoryDate, checkValidDate, checkPastDate];

		const checkEnquiryDetails = createValidator(
			body(detailsFieldName)
				.trim()
				.isLength({ min: 1 })
				.withMessage(`You must enter the ${extendedDetailsFieldName}`)
		);

		return createValidator([
			...(paramsToValidate.includes('date') ? checkEnquiryDate : []),
			...(paramsToValidate.includes('details') ? [checkEnquiryDetails] : [])
		])(request, response, next);
	};

export const validateS1EnquiryDetailsWelsh = createValidator(
	body('enquiryDetailsWelsh')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the S51 Enquiry details in Welsh')
		.isLength({ max: 255 })
		.withMessage('The S51 Enquiry details in Welsh must be 255 characters or fewer')
);

export const validateS1AdviceDetailsWelsh = createValidator(
	body('adviceDetailsWelsh')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the S51 Advice given in Welsh')
		.isLength({ max: 255 })
		.withMessage('The S51 Advice given in Welsh must be 255 characters or fewer')
);

export const validateS51AdviceToChange = createValidator(
	body('selectedFilesIds')
		.isArray({ min: 1 })
		.withMessage('Select advice to make changes to statuses')
);

export const validateS51AdviceToPublish = createValidator(
	body('selectedFilesIds').isArray({ min: 1 }).withMessage('Select advice to publish')
);

export const validateS51AdviceActions = createValidator(
	body('isRedacted')
		.custom((value, { req }) => !!value || !!req?.body?.status)
		.withMessage('Select a status to apply a change')
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const validateS51AdviceReadyToPublish = async (req, res, next) => {
	// @ts-ignore
	const { status = '', /** @type {{selectedFilesIds: string[]}} */ selectedFilesIds = [] } =
		req.body || {};
	const { caseIsWelsh = false, caseId } = res.locals || {};

	if (!caseIsWelsh || status !== 'ready_to_publish') {
		return next();
	}

	const s51AdviceItems = await Promise.all(
		selectedFilesIds.map((/** @type {{adviceId: string}} */ adviceId) =>
			getS51Advice(caseId, Number(adviceId))
		)
	);

	const incompleteS51AdviceItems = s51AdviceItems.filter(
		(adviceItem) =>
			!adviceItem.titleWelsh || !adviceItem.enquiryDetailsWelsh || !adviceItem.adviceDetailsWelsh
	);

	if (incompleteS51AdviceItems.length === 0) {
		return next();
	}

	return createValidator(
		incompleteS51AdviceItems.map((adviceItem) =>
			body('edit-id-' + Number(adviceItem.id))
				.custom(() => false)
				.withMessage('You must fill in all mandatory S51 Advice properties to publish S51 Advice')
		)
	)(req, res, next);
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const validateS51UniqueTitle = (req, res, next) => {
	res.locals.title = req.body.title?.toString() || '';

	next();
};
