import { body } from 'express-validator';

/**
 *
 * @param {{fieldName: string, extendedFieldName: string}} field
 * @param {Record<string, string>} data
 * @returns {import("express-validator").ValidationChain}
 */
export const validationTimeMandatory = (field, data) => {
	const { fieldName, extendedFieldName } = field;

	const stringHours = data[`${fieldName}.hours`] || '';
	const stringMinutes = data[`${fieldName}.minutes`] || '';

	return body(fieldName)
		.custom(() => {
			return !(stringHours === '' && stringMinutes === '');
		})
		.withMessage(`You must enter the ${extendedFieldName}`);
};

/**
 *
 * @param {{fieldName: string, extendedFieldName: string}} field
 * @param {{fieldName: string, extendedFieldName: string}|null} compareField
 * @param {Record<string, string>} data
 * @returns {import("express-validator").ValidationChain}
 */
export const validationTimeStartBeforeEnd = (field, compareField, data) => {
	const { fieldName, extendedFieldName } = field;

	const stringHours = data[`${fieldName}.hours`] || '';
	const stringMinutes = data[`${fieldName}.minutes`] || '';

	const stringCompareHours = data[`${compareField?.fieldName}.hours`] || '24';
	const stringCompareMinutes = data[`${compareField?.fieldName}.minutes`] || '61';

	return body(fieldName)
		.custom(() => {
			if (stringHours > stringCompareHours) {
				return false;
			}
			if (stringMinutes > stringCompareMinutes) {
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
 * @returns {import("express-validator").ValidationChain}
 */
export const validationTimeValid = (field, data) => {
	const { fieldName, extendedFieldName } = field;

	const stringHours = data[`${fieldName}.hours`] || '';
	const stringMinutes = data[`${fieldName}.minutes`] || '';

	const hours = Number.parseInt(stringHours, 10);
	const minutes = Number.parseInt(stringMinutes, 10);

	return body(fieldName)
		.custom(() => {
			const bothEmpty = stringHours === '' && stringMinutes === '';
			const validHours = stringHours !== '' && hours >= 0 && hours < 24;
			const validMinutes = stringMinutes !== '' && minutes >= 0 && minutes < 60;
			const validFormat = stringMinutes.length === 2 && stringHours.length === 2;

			return bothEmpty || (validHours && validMinutes && validFormat);
		})
		.withMessage(`You must enter the ${extendedFieldName} in the correct format`);
};
