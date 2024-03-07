import { body } from 'express-validator';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} parameterName
 * @param {string} regex
 * @returns {ValidationChain}
 */
const validateRegex = (parameterName, regex) =>
	body(parameterName).exists({ checkFalsy: true }).matches(regex);

export default validateRegex;
