import { body } from 'express-validator';

/**
 *
 * @param {string} fieldName
 * @param {string} extendedFieldName
 * @param {{hours?: string, minutes?: string}} timeParams
 * @returns {import("express-validator").ValidationChain}
 */
export const createValidationTimeMandatory = (
	fieldName,
	extendedFieldName,
	{ hours: stringHours = '', minutes: stringMinutes = '' }
) => {
	return body(fieldName)
		.custom(() => {
			return !(stringHours === '' && stringMinutes === '');
		})
		.withMessage(`You must enter the ${extendedFieldName}`);
};

/**
 *
 * @param {string} fieldName
 * @param {string} extendedFieldName
 * @param {{hours?: string, minutes?: string}} timeParams
 * @returns {import("express-validator").ValidationChain}
 */
export const createValidationTimeValid = (
	fieldName,
	extendedFieldName,
	{ hours: stringHours = '', minutes: stringMinutes = '' }
) => {
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
