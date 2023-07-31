import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	validationDateFuture,
	validationDateMandatory,
	validationDateValid
} from '../../common/validators/dates.validators.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * Dispatch the POST route to the right validator
 *
 * @type {RequestHandler}
 */
export const validatorsDispatcher = async (request, response, next) => {
	const { metaDataName } = request.params;

	/** @type {Record<string, RequestHandler>} */
	const validators = {
		name: validateDocumentationMetaName,
		description: validateDocumentationMetaDescription,
		webfilter: validateDocumentationMetaFilter1,
		agent: validateDocumentationMetaRepresentative,
		author: validateDocumentationMetaAuthor,
		redaction: validateDocumentationMetaRedacted,
		'receipt-date': validateDocumentationMetaDateCreated,
		'published-date': validateDocumentationMetaDatePublished
	};

	if (validators[metaDataName]) {
		return validators[metaDataName](request, response, next);
	}

	return next();
};

export const validateDocumentationMetaName = createValidator(
	body('fileName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a file name')
		.isLength({ max: 255 })
		.withMessage('The name must be 255 characters or fewer')
);

export const validateDocumentationMetaDescription = createValidator(
	body('description')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a description of the document')
		.isLength({ max: 800 })
		.withMessage('The description must be 800 characters or fewer')
);

export const validateDocumentationMetaAuthor = createValidator(
	body('author')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter who the document is from')
		.isLength({ max: 150 })
		.withMessage('The value must be 150 characters or fewer')
);

export const validateDocumentationMetaFilter1 = createValidator(
	body('filter1')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a webfilter')
		.isLength({ max: 100 })
		.withMessage('The webfilter must be 100 characters or fewer')
);

export const validateDocumentationMetaRepresentative = createValidator(
	body('representative')
		.trim()
		.isLength({ max: 150 })
		.withMessage('The agent name be 150 characters or fewer')
);

export const validateDocumentationMetaRedacted = createValidator(
	body('redactedStatus')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must select a redaction status')
);

/**
 * Check date is valid and in the past
 *
 * @type {RequestHandler}
 */
export const validateDocumentationMetaDateCreated = (request, response, next) => {
	const fieldName = 'dateCreated';
	const extendedFieldName = 'receipt date';

	const checkMandatoryDate = validationDateMandatory(
		{ fieldName, extendedFieldName },
		request.body
	);

	const checkValidDate = validationDateValid({ fieldName, extendedFieldName }, request.body);

	const checkPastDate = validationDateFuture(
		{ fieldName, extendedFieldName },
		request.body,
		false,
		false
	);

	return createValidator([checkMandatoryDate, checkValidDate, checkPastDate])(
		request,
		response,
		next
	);
};

/**
 * Check date is valid and in the past
 *
 * @type {RequestHandler}
 */
export const validateDocumentationMetaDatePublished = (request, response, next) => {
	const fieldName = 'datePublished';
	const extendedFieldName = 'published date';

	const checkMandatoryDate = validationDateMandatory(
		{ fieldName, extendedFieldName },
		request.body
	);

	const checkValidDate = validationDateValid({ fieldName, extendedFieldName }, request.body);

	const checkPastDate = validationDateFuture(
		{ fieldName, extendedFieldName },
		request.body,
		false,
		false
	);

	return createValidator([checkMandatoryDate, checkValidDate, checkPastDate])(
		request,
		response,
		next
	);
};
