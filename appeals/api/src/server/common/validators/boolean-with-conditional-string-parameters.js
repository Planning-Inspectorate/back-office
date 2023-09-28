import { body } from 'express-validator';
import validateBooleanParameter from './boolean-parameter.js';
import validateStringParameter from './string-parameter.js';
import { ERROR_MUST_HAVE_DETAILS, ERROR_MUST_NOT_HAVE_DETAILS } from '#endpoints/constants.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';

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
			const stringTokenReplacements = [detailsParameterName, booleanParameterName, value];

			if (value === triggerValue && !req.body[detailsParameterName]) {
				throw new Error(stringTokenReplacement(ERROR_MUST_HAVE_DETAILS, stringTokenReplacements));
			} else if (value !== triggerValue && req.body[detailsParameterName]) {
				throw new Error(
					stringTokenReplacement(ERROR_MUST_NOT_HAVE_DETAILS, stringTokenReplacements)
				);
			}

			return true;
		})
];

export default validateBooleanWithConditionalStringParameters;
