import { body } from 'express-validator';
import { ERROR_MUST_BE_BOOLEAN } from '#endpoints/constants.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} parameterName
 * @returns {ValidationChain}
 */
const validateBooleanParameter = (parameterName) =>
	body(parameterName)
		.optional()
		.isBoolean()
		.withMessage(ERROR_MUST_BE_BOOLEAN)
		.customSanitizer((value) => (['false', '0'].includes(value) ? false : !!value));

export default validateBooleanParameter;
