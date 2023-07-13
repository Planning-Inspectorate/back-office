import { joinDateAndTime } from '#endpoints/appeals/appeals.service.js';
import { ERROR_MUST_BE_CORRECT_DATE_FORMAT } from '#endpoints/constants.js';
import { body } from 'express-validator';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} parameterName
 * @returns {ValidationChain}
 */
const validateDateParameter = (parameterName) =>
	body(parameterName)
		.optional()
		.isDate()
		.withMessage(ERROR_MUST_BE_CORRECT_DATE_FORMAT)
		.customSanitizer(joinDateAndTime);

export default validateDateParameter;
