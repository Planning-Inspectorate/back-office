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

	const allEmpty = stringDay === '' && stringMonth === '' && stringYear === '';

	return body(fieldName)
		.custom(() => {
			return allEmpty || stringDay === '' || (day > 0 && day < 32);
		})
		.withMessage(`Enter a valid day for the ${extendedFieldName}`)
		.custom(() => {
			return allEmpty || stringMonth === '' || (month > 0 && month < 13);
		})
		.withMessage(`Enter a valid month for the ${extendedFieldName}`)
		.custom(() => {
			return allEmpty || stringYear === '' || stringYear.length === 4;
		})
		.withMessage(`Enter a valid year for the ${extendedFieldName}`)
		.custom(() => {
			return (
				allEmpty ||
				(!(stringDay.length !== 2 || stringMonth.length !== 2 || stringYear.length !== 4) &&
					dateIsValid(year, month, day))
			);
		})
		.withMessage(`You must enter the ${extendedFieldName} in the correct format`);
};

/**
 *
 * @param {Record<string, string>} data
 * @returns {import("express-validator").ValidationChain}
 */
export const validationDateStartBeforeEnd = (data) => {
	const stringDay = data['startDate.day'] || '0';
	const stringMonth = data['startDate.month'] || '0';
	const stringYear = data[`startDate.year`] || '0';
	const stringHours = data[`startTime.hours`] || '0';
	const stringMinutes = data[`startTime.minutes`] || '0';

	const stringCompareDay = data[`endDate.day`] || '32';
	const stringCompareMonth = data[`endDate.month`] || '13';
	const stringCompareYear = data[`endDate.year`] || '9999';
	const stringCompareHours = data[`endTime.hours`] || '24';
	const stringCompareMinutes = data[`endTime.minutes`] || '60';

	const startTime = `${stringHours}:${stringMinutes}`;
	const endTime = `${stringCompareHours}:${stringCompareMinutes}`;

	const startDate = `${stringYear}-${stringMonth}-${stringDay}`;
	const endDate = `${stringCompareYear}-${stringCompareMonth}-${stringCompareDay}`;

	const startDateTime = new Date(`${startDate} ${startTime}`);
	const endDateTime = new Date(`${endDate} ${endTime}`);

	if (stringDay === '0' || startDate === endDate) {
		return body('startTime')
			.custom(() => startTime < endTime)
			.withMessage(`The item end time must be after the item start time`);
	}

	return body('startDate')
		.custom(() => startDateTime < endDateTime)
		.withMessage(`The item end date must be after the item start date`);
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
