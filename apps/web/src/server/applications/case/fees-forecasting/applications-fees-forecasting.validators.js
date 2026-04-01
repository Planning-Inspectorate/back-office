import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	validationDateValid,
	validationDateMandatory
} from '../../common/validators/dates.validators.js';
import { getSectionData } from './applications-fees-forecasting.utils.js';
import { sectionData, urlSectionNames } from './fees-forecasting.config.js';

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * Calls specified validator function based on section name in request
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
export const feesForecastingValidator = (request, response, next) => {
	let sectionName;

	if (request.isFeeEdit) {
		sectionName = 'manage-fee';
	} else if (request.isProjectMeetingEdit) {
		sectionName = 'manage-project-meeting';
	} else if (request.isEvidencePlanMeetingEdit) {
		sectionName = 'manage-evidence-plan-meeting';
	} else {
		sectionName = request.params.sectionName || '';
	}

	/** @type {Record<string, RequestHandler>} */
	const validators = {
		'maturity-evaluation-matrix': validateFeesForecastingDateInput,
		'scoping-submission': validateFeesForecastingDateInput,
		'consultation-milestone': validateFeesForecastingDateInput,
		'programme-document-received': validateFeesForecastingDateInput,
		'programme-document-reviewed': validateFeesForecastingDateInput,
		'programme-document-comments': validateFeesForecastingDateInput,
		'add-new-fee': validateFeesForecastingAddFee,
		'manage-fee': validateFeesForecastingAddFee,
		'add-project-meeting': validateFeesForecastingProjectMeeting,
		'manage-project-meeting': validateFeesForecastingProjectMeeting,
		'add-evidence-plan-meeting': validateFeesForecastingEvidencePlanMeeting,
		'manage-evidence-plan-meeting': validateFeesForecastingEvidencePlanMeeting,
		'disagreement-summary-statement': validateFeesForecastingRadioDateInput,
		'policy-compliance-document': validateFeesForecastingRadioDateInput,
		'design-approach-document': validateFeesForecastingRadioDateInput,
		'control-documents': validateFeesForecastingRadioDateInput,
		'compulsory-acquisition': validateFeesForecastingRadioDateInput,
		'public-sector-equality-duty': validateFeesForecastingRadioDateInput,
		'fast-track-admission': validateFeesForecastingRadioDateInput,
		'multiparty-application': validateFeesForecastingRadioDateInput,
		's61-summary-link': validateFeesForecastingTextInput,
		'programme-document-link': validateFeesForecastingTextInput,
		'issues-tracker-link': validateFeesForecastingTextInput
	};

	if (Object.keys(validators).includes(sectionName)) {
		const validator = validators[sectionName];
		if (validator && typeof validator === 'function') {
			return validator(request, response, next);
		}
	}

	return next();
};

/**
 * Checks dates are in MM/DD/YYYY format
 *
 * @type {RequestHandler}
 */
export const validateFeesForecastingDateInput = (request, response, next) => {
	const { body, params } = request;
	const { sectionName } = params;

	const section = getSectionData(sectionName, urlSectionNames, sectionData);
	const fieldName = section?.fieldName || '';
	const extendedFieldName = section?.sectionTitle || '';

	const validation = validationDateValid({ fieldName, extendedFieldName }, body);

	return createValidator([validation])(request, response, next);
};

/**
 * Checks fee data is formatted correctly
 *
 * @type {RequestHandler}
 */
export const validateFeesForecastingAddFee = (request, response, next) => {
	const invoiceDateValidation = validationDateValid(
		{ fieldName: 'invoicedDate', extendedFieldName: 'date of invoice' },
		request.body
	);
	const paymentDueDateValidation = validationDateValid(
		{ fieldName: 'paymentDueDate', extendedFieldName: 'payment due date' },
		request.body
	);
	const paymentDateValidation = validationDateValid(
		{ fieldName: 'paymentDate', extendedFieldName: 'payment date' },
		request.body
	);
	const refundDateValidation = validationDateValid(
		{ fieldName: 'refundIssueDate', extendedFieldName: 'refund date' },
		request.body
	);

	const validator = [
		body('invoiceStage').trim().notEmpty().withMessage('You must select a case stage'),
		body('invoiceNumber')
			.trim()
			.notEmpty()
			.withMessage('You must enter the invoice number')
			.isNumeric()
			.withMessage('The invoice number must be a number'),
		body('amountDue')
			.optional({ checkFalsy: true })
			.matches(/^\d+\.\d{2}$/)
			.withMessage('The amount due must be a decimal number'),
		invoiceDateValidation,
		paymentDueDateValidation,
		paymentDateValidation,
		body('refundCreditNoteNumber')
			.optional({ checkFalsy: true })
			.isNumeric()
			.withMessage('The refund credit note number must be a number'),
		body('refundAmount')
			.optional({ checkFalsy: true })
			.matches(/^\d+\.\d{2}$/)
			.withMessage('The amount refunded must be a decimal number'),
		refundDateValidation
	];

	return createValidator(validator)(request, response, next);
};

/**
 * Checks project meeting data is formatted correctly
 *
 * @type {RequestHandler}
 */
export const validateFeesForecastingProjectMeeting = (request, response, next) => {
	const projectMeetingDateValidation = validationDateValid(
		{ fieldName: 'meetingDate', extendedFieldName: 'Date of project meeting' },
		request.body
	);

	const validator = [
		body('agenda').trim().notEmpty().withMessage('Select Meeting agenda'),
		body('otherAgenda')
			.if(body('agenda').equals('Other'))
			.trim()
			.notEmpty()
			.withMessage('Enter meeting agenda'),
		projectMeetingDateValidation
	];

	return createValidator(validator)(request, response, next);
};

/**
 * Checks evidence plan meeting data is formatted correctly
 *
 * @type {RequestHandler}
 */
export const validateFeesForecastingEvidencePlanMeeting = (request, response, next) => {
	const evidencePlanMeetingDateValidation = validationDateValid(
		{ fieldName: 'meetingDate', extendedFieldName: 'Date of evidence plan meeting' },
		request.body
	);

	const validator = [
		body('agenda').trim().notEmpty().withMessage('Enter Meeting agenda'),
		body('pinsRole').trim().notEmpty().withMessage('Select Planning Inspectorate role'),
		evidencePlanMeetingDateValidation
	];

	return createValidator(validator)(request, response, next);
};

/**
 * Checks radio-date-input data is formatted correctly
 *
 * @type {RequestHandler}
 */
export const validateFeesForecastingRadioDateInput = (request, response, next) => {
	const { sectionName } = request.params;

	const section = getSectionData(sectionName, urlSectionNames, sectionData);
	const fieldName = section?.fieldName || '';
	const dateFieldName = section?.dateFieldName || 'submissionDate';
	const extendedFieldName = section?.sectionTitle || '';

	const validators = [
		body(fieldName)
			.trim()
			.notEmpty()
			.withMessage(`You must select an option for ${extendedFieldName}`)
	];

	if (request.body[fieldName] === 'submitted_by_applicant') {
		const dateMandatoryValidation = validationDateMandatory(
			{ fieldName: dateFieldName, extendedFieldName: `${extendedFieldName} submission date` },
			request.body
		);
		const dateValidation = validationDateValid(
			{ fieldName: dateFieldName, extendedFieldName: `${extendedFieldName} submission date` },
			request.body
		);
		validators.push(dateMandatoryValidation, dateValidation);
	}

	return createValidator(validators)(request, response, next);
};

/**
 * Checks text-input data is formatted correctly
 *
 * @type {RequestHandler}
 */
export const validateFeesForecastingTextInput = (request, response, next) => {
	const { sectionName } = request.params;
	const section = getSectionData(sectionName, urlSectionNames, sectionData);
	const fieldName = section?.fieldName || '';

	const validator = [
		// includes regex to exclude @ signs which are valid in isURL
		body(fieldName)
			.trim()
			.notEmpty()
			.withMessage('Enter a valid hyperlink')
			.matches(/^[^@]*$/)
			.withMessage('Enter a valid hyperlink')
			.isURL({
				require_tld: true,
				require_port: false,
				allow_trailing_dot: false,
				allow_protocol_relative_urls: false,
				allow_query_components: false,
				allow_fragments: false
			})
			.withMessage('Enter a valid hyperlink')
	];

	return createValidator(validator)(request, response, next);
};
