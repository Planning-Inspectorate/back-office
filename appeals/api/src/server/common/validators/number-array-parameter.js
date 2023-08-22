import { body } from 'express-validator';
import {
	ERROR_MUST_BE_ARRAY_OF_NUMBERS,
	ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE
} from '#endpoints/constants.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {Array<string | number>} values
 * @returns {boolean}
 */
const isNumberArray = (values) => values.every((value) => typeof value === 'number');

/**
 * @param {string} parameterName
 * @param {(() => void) | undefined} customFn
 * @returns {ValidationChain}
 */
const validateNumberArrayParameter = (parameterName, customFn = undefined) => {
	const validator = body(parameterName)
		.optional()
		.isArray()
		.withMessage(ERROR_MUST_BE_ARRAY_OF_NUMBERS)
		.custom((values) => isNumberArray(values))
		.withMessage(ERROR_MUST_BE_ARRAY_OF_NUMBERS)
		.custom((value) => value[0])
		.withMessage(ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE);

	customFn && validator.custom(customFn);

	return validator.customSanitizer((values) =>
		typeof values === 'object' ? [...new Set(values)] : values
	);
};

export default validateNumberArrayParameter;
