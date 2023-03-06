import { createValidator } from '@pins/express';
import { body } from 'express-validator';

/** @typedef{import('express').RequestHandler} RequestHandler */

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
		description: validateDocumentationMetaDescription
	};

	if (validators[metaDataName]) {
		return validators[metaDataName](request, response, next);
	}

	return next();
};

// TODO: replace with correct fieldName
export const validateDocumentationMetaName = createValidator(
	body('documentName')
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
