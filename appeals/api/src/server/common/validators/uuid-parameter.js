import { ERROR_MUST_BE_UUID } from '#endpoints/constants.js';
import { param } from 'express-validator';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {{
 *  parameterName: string,
 *  parameterType?: any,
 *  isRequired?: boolean,
 *  allowNull?: boolean
 * }} param0
 * @returns {ValidationChain}
 */
const validateUuidParameter = ({
	parameterName,
	parameterType = param,
	isRequired = true,
	allowNull = false
}) => {
	const validator = parameterType(parameterName);

	!isRequired && validator.optional(allowNull ? { values: 'null' } : {});

	return validator.isUUID().withMessage(ERROR_MUST_BE_UUID);
};

export default validateUuidParameter;
