import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { validationDateValid } from '../../common/validators/dates.validators.js';
import { getSectionData } from './applications-fees-forecasting.utils.js';
import { sectionData, urlSectionNames } from './fees-forecasting.config.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * Calls specified validator function based on section name in request
 *
 * @type {RequestHandler}
 */
export const feesForecastingValidator = (request, response, next) => {
	const { sectionName } = request.params;

	/** @type {Record<string, RequestHandler>} */
	const validators = {
		'maturity-evaluation-matrix': validateFeesForecastingDate,
		'scoping-submission': validateFeesForecastingDate,
		'consultation-milestone': validateFeesForecastingDate,
		'programme-document-received': validateFeesForecastingDate,
		'programme-document-reviewed': validateFeesForecastingDate,
		'programme-document-comments': validateFeesForecastingDate,
		'add-new-fee': validateFeesForecastingAddFee,
		'add-project-meeting': validateFeesForecastingProjectMeeting
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
export const validateFeesForecastingDate = (request, response, next) => {
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
