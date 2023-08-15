import { body } from 'express-validator';
import {
	ERROR_CANNOT_BE_EMPTY_STRING,
	ERROR_MAX_LENGTH_CHARACTERS,
	ERROR_MUST_BE_STRING,
	MAX_LENGTH_300
} from '#endpoints/constants.js';
import errorMessageReplacement from '#utils/error-message-replacement.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} parameterName
 * @param {number} maxLength
 * @returns {ValidationChain}
 */
const validateStringParameter = (parameterName, maxLength = MAX_LENGTH_300) =>
	body(parameterName)
		.optional()
		.isString()
		.withMessage(ERROR_MUST_BE_STRING)
		.notEmpty()
		.withMessage(ERROR_CANNOT_BE_EMPTY_STRING)
		.isLength({ max: maxLength })
		.withMessage(errorMessageReplacement(ERROR_MAX_LENGTH_CHARACTERS, maxLength));

export default validateStringParameter;
