import { body } from 'express-validator';
import { dateIsValid } from '../../../lib/dates.js';

/**
 *
 * @param {string} fieldName
 * @param {string} extendedFieldName
 * @param {{day: string, month: string, year: string}} dateParams
 * @returns {import("express-validator").ValidationChain}
 */
export const createValidationDateValid = (fieldName, extendedFieldName, { day, month, year }) =>
	body(fieldName)
		.custom(() => {
			return day === '' || (Number.parseInt(day, 10) > 0 && Number.parseInt(day, 10) < 32);
		})
		.withMessage(`Enter a valid day for the ${extendedFieldName}`)
		.custom(() => {
			return month === '' || (Number.parseInt(month, 10) > 0 && Number.parseInt(month, 10) < 13);
		})
		.withMessage(`Enter a valid month for the ${extendedFieldName}`)
		.custom(() => {
			return year === '' || `${year}`.length === 4;
		})
		.withMessage(`Enter a valid year for the ${extendedFieldName}`)
		.custom(() => {
			return (
				(day === '' && month === '' && year === '') ||
				dateIsValid(Number.parseInt(year, 10), Number.parseInt(month, 10), Number.parseInt(day, 10))
			);
		})
		.withMessage(`Enter a valid ${extendedFieldName}`);

/**
 *
 * @param {string} fieldName
 * @param {string} extendedFieldName
 * @param {{day: string, month: string, year: string}} dateParams
 * @returns {import("express-validator").ValidationChain}
 */
export const createValidationDateFuture = (fieldName, extendedFieldName, { day, month, year }) =>
	body(fieldName)
		.custom(() => {
			const date = new Date(
				Number.parseInt(year, 10),
				Number.parseInt(month, 10) - 1,
				Number.parseInt(day, 10)
			);

			return (day === '' && month === '' && year === '') || date > new Date();
		})
		.withMessage(`The ${extendedFieldName} must be in the future`);
