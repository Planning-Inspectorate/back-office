import { body } from 'express-validator';
import { ERROR_MUST_BE_NUMBER } from '#endpoints/constants.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} parameterName
 * @returns {ValidationChain}
 */
const validateNumberParameter = (parameterName) =>
	body(parameterName).optional().isInt().withMessage(ERROR_MUST_BE_NUMBER).toInt();

export default validateNumberParameter;
