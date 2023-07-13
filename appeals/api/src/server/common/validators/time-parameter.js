import { ERROR_MUST_BE_CORRECT_TIME_FORMAT } from '#endpoints/constants.js';
import { body } from 'express-validator';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} parameterName
 * @returns {ValidationChain}
 */
const validateTimeParameter = (parameterName) =>
	body(parameterName).optional().isTime({}).withMessage(ERROR_MUST_BE_CORRECT_TIME_FORMAT);

export default validateTimeParameter;
