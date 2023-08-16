import { body } from 'express-validator';
import validateBooleanParameter from './boolean-parameter.js';
import validateStringParameter from './string-parameter.js';
import { ERROR_MUST_HAVE_DETAILS, ERROR_MUST_NOT_HAVE_DETAILS } from '#endpoints/constants.js';
import errorMessageReplacement from '#utils/error-message-replacement.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} booleanParameterName
 * @param {string} detailsParameterName
 * @param {boolean} triggerValue
 * @returns {ValidationChain[]}
 */
const validateBooleanWithConditionalStringParameters = (
	booleanParameterName,
	detailsParameterName,
	triggerValue
) => [
	validateBooleanParameter(booleanParameterName),
	validateStringParameter(detailsParameterName),
	body(booleanParameterName)
		.optional()
		.custom((value, { req }) => {
			const errorMessageReplacements = [detailsParameterName, booleanParameterName, value];

			if (value === triggerValue && !req.body[detailsParameterName]) {
				throw new Error(errorMessageReplacement(ERROR_MUST_HAVE_DETAILS, errorMessageReplacements));
			} else if (value !== triggerValue && req.body[detailsParameterName]) {
				throw new Error(
					errorMessageReplacement(ERROR_MUST_NOT_HAVE_DETAILS, errorMessageReplacements)
				);
			}

			return true;
		})
];

export default validateBooleanWithConditionalStringParameters;
