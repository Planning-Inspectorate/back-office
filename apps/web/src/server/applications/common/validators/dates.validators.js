import { body } from 'express-validator';
import { dateIsValid } from '../../../lib/dates.js';

/**
 *
 * @param {{fieldName: string, extendedFieldName: string}} field
 * @param {Record<string, string>} data
 * @returns {import("express-validator").ValidationChain}
 */
export const validationDateMandatory = (field, data) => {
	const { fieldName, extendedFieldName } = field;

	const stringDay = data[`${fieldName}.day`] || '';
	const stringMonth = data[`${fieldName}.month`] || '';
	const stringYear = data[`${fieldName}.year`] || '';

	return body(fieldName)
		.custom(() => {
			return !(stringDay === '' && stringMonth === '' && stringYear === '');
		})
		.withMessage(`You must enter the ${extendedFieldName}`);
};

/**
 *
 * @param {{fieldName: string, extendedFieldName: string}} field
 * @param {Record<string, string>} data
 * @returns {import("express-validator").ValidationChain}
 */
export const validationDateValid = (field, data) => {
	const { fieldName, extendedFieldName } = field;

	const stringDay = data[`${fieldName}.day`] || '';
	const stringMonth = data[`${fieldName}.month`] || '';
	const stringYear = data[`${fieldName}.year`] || '';

	const day = Number.parseInt(stringDay, 10);
	const month = Number.parseInt(stringMonth, 10);
	const year = Number.parseInt(stringYear, 10);

	return body(fieldName)
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
			return (
				!(stringDay.length !== 2 || stringMonth.length !== 2 || stringYear.length !== 4) &&
				dateIsValid(year, month, day)
			);
		})
		.withMessage(`You must enter the ${extendedFieldName} in the correct format`);
};

/**
 *
 * @param {{fieldName: string, extendedFieldName: string}} field
 * @param {{fieldName: string, extendedFieldName: string}|null} compareField
 * @param {Record<string, string>} data
 * @returns {import("express-validator").ValidationChain}
 */
export const validationDateStartBeforeEnd = (field, compareField, data) => {
	const { fieldName, extendedFieldName } = field;

	const stringDay = data[`${fieldName}.day`] || '';
	const stringMonth = data[`${fieldName}.month`] || '';
	const stringYear = data[`${fieldName}.year`] || '';

	const stringCompareDay = data[`${compareField?.fieldName}.day`] || '32';
	const stringCompareMonth = data[`${compareField?.fieldName}.month`] || '13';
	const stringCompareYear = data[`${compareField?.fieldName}.year`] || '9999';

	return body(fieldName)
		.custom(() => {
			if (stringYear > stringCompareYear) {
				return false;
			}
			if (stringMonth > stringCompareMonth) {
				return false;
			}
			if (stringDay > stringCompareDay) {
				return false;
			}
			return true;
		})
		.withMessage(`The ${compareField?.extendedFieldName} must be after the ${extendedFieldName}`);
};

/**
 *
 * @param {{fieldName: string, extendedFieldName: string}} field
 * @param {Record<string, string>} data
 * @param {boolean} mustBeFuture
 * @returns {import("express-validator").ValidationChain}
 */
export const validationDateFuture = (field, data, mustBeFuture) => {
	const { fieldName, extendedFieldName } = field;

	const day = data[`${fieldName}.day`] || '';
	const month = data[`${fieldName}.month`] || '';
	const year = data[`${fieldName}.year`] || '';

	return body(fieldName)
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
};
