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
		descriptionWelsh: validateDocumentationMetaDescriptionWelsh,
		webfilter: validateDocumentationMetaFilter1,
		webfilterWelsh: validateDocumentationMetaFilter1Welsh,
		agent: validateDocumentationMetaRepresentative,
		author: validateDocumentationMetaAuthor,
		authorWelsh: validateDocumentationMetaAuthorWelsh,
		redaction: validateDocumentationMetaRedacted,
		'receipt-date': validateDocumentationMetaDateCreated,
		'published-date': validateDocumentationMetaDatePublished
	};

	if (Object.keys(validators).includes(metaDataName)) {
		const validator = validators[metaDataName];

		if (validator && typeof validator === 'function') {
			return validator(request, response, next);
		}
	}

	return next();
};

export const validateDocumentationMetaName = createValidator(
	body('fileName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter file name')
		.isLength({ max: 255 })
		.withMessage('File name must be 255 characters or less')
);

export const validateDocumentationMetaDescription = createValidator(
	body('description')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter document description')
		.isLength({ max: 800 })
		.withMessage('Document description must be 800 characters or less')
);

export const validateDocumentationMetaDescriptionWelsh = createValidator(
	body('descriptionWelsh')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter document description in Welsh')
		.isLength({ max: 800 })
		.withMessage('Document description in Welsh must be 800 characters or less')
);

export const validateDocumentationMetaAuthor = createValidator(
	body('author')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter who the document is from')
		.isLength({ max: 150 })
		.withMessage('Who the document is from must be 150 characters or less')
);

export const validateDocumentationMetaAuthorWelsh = createValidator(
	body('authorWelsh')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter who the document is from in Welsh')
		.isLength({ max: 150 })
		.withMessage('Who the document is from in Welsh must be 150 characters or less')
);

export const validateDocumentationMetaFilter1 = createValidator(
	body('filter1')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter webfilter')
		.isLength({ max: 100 })
		.withMessage('Webfilter must be 100 characters or less')
);

export const validateDocumentationMetaFilter1Welsh = createValidator(
	body('filter1Welsh')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter webfilter in Welsh')
		.isLength({ max: 100 })
		.withMessage('Webfilter must be 100 characters or less')
);

export const validateDocumentationMetaRepresentative = createValidator(
	body('representative')
		.trim()
		.isLength({ max: 150 })
		.withMessage('Agent name must be 150 characters or less')
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
