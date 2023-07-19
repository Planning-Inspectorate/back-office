import { body } from 'express-validator';
import {
	ERROR_MUST_BE_ARRAY_OF_IDS,
	ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE
} from '#endpoints/constants.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} parameterName
 * @param {() => void} customFn
 * @returns {ValidationChain}
 */
const validateValidationOutcomeReasons = (parameterName, customFn) =>
	body(parameterName)
		.optional()
		.isArray()
		.withMessage(ERROR_MUST_BE_ARRAY_OF_IDS)
		.custom((value) => value[0])
		.withMessage(ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE)
		.custom(customFn);

export default validateValidationOutcomeReasons;
