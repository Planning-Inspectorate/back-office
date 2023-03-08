import { body } from 'express-validator';
import { dateIsValid } from '../../../lib/dates.js';

/**
 *
 * @param {string} fieldName
 * @param {string} extendedFieldName
 * @param {{day?: string, month?: string, year?: string}} dateParams
 * @returns {import("express-validator").ValidationChain}
 */
export const createValidationDateValid = (
	fieldName,
	extendedFieldName,
	{ day: stringDay = '', month: stringMonth = '', year: stringYear = '' }
) => {
	const day = Number.parseInt(stringDay, 10);
	const month = Number.parseInt(stringMonth, 10);
	const year = Number.parseInt(stringYear, 10);

	return body(fieldName)
		.custom(() => {
			return !(stringDay === '' && stringMonth === '' && stringYear === '');
		})
		.withMessage(`Enter the ${extendedFieldName}`)
		.custom(() => {
			return stringDay === '' || (day > 0 && day < 32);
		})
		.withMessage(`Enter a valid day for the ${extendedFieldName}`)
		.custom(() => {
			return stringMonth === '' || (month > 0 && month < 13);
		})
		.withMessage(`Enter a valid month for the ${extendedFieldName}`)
		.custom(() => {
			return stringYear === '' || stringYear.length === 4;
		})
		.withMessage(`Enter a valid year for the ${extendedFieldName}`)
		.custom(() => {
			return dateIsValid(year, month, day);
		})
		.withMessage(`Enter a valid ${extendedFieldName}`);
};

/**
 *
 * @param {string} fieldName
 * @param {string} extendedFieldName
 * @param {{day: string, month: string, year: string}} dateParams
 * @param {boolean} mustBeFuture
 * @returns {import("express-validator").ValidationChain}
 */
export const createValidationDateFuture = (
	fieldName,
	extendedFieldName,
	{ day, month, year },
	mustBeFuture
) =>
	body(fieldName)
		.custom(() => {
			const date = new Date(
				Number.parseInt(year, 10),
				Number.parseInt(month, 10) - 1,
				Number.parseInt(day, 10)
			);

			const isFuture = date > new Date();

			return isFuture === mustBeFuture;
		})
		.withMessage(`The ${extendedFieldName} ${mustBeFuture ? 'must' : 'cannot'} be in the future`);
