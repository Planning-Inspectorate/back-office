import { ERROR_MUST_BE_GUID } from '#endpoints/constants.js';
import { param } from 'express-validator';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} parameterName
 * @returns {ValidationChain}
 */
const validateGuidParameter = (parameterName) =>
	param(parameterName).isUUID().withMessage(ERROR_MUST_BE_GUID);

export default validateGuidParameter;
