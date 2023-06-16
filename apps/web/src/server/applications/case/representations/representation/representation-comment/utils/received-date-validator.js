import { body } from 'express-validator';
import { createValidator } from '@pins/express';
import { isAfter, endOfDay } from 'date-fns';

/**
 *
 * @param {object} input
 * @param {string} input.dayInput
 * @param {string} input.monthInput
 * @param {string} input.yearInput
 * @param {string} input.inputPrefix
 * @param {string} messagePrefix
 * @return {*}
 */
const validateDateIsNotInTheFuture = (
	{ dayInput, monthInput, yearInput, inputPrefix },
	messagePrefix
) => {
	return [
		body(inputPrefix).custom((_, { req: { body } }) => {
			const receivedDate = new Date(`${body[yearInput]}-${body[monthInput]}-${body[dayInput]}`);
			const today = endOfDay(new Date());

			if (isAfter(receivedDate, today)) {
				throw new Error(`${messagePrefix} must be today or in the past`);
			}

			return true;
		})
	];
};
/**
 *
 * @param {object} inputNamesMap
 * @param {string} inputNamesMap.dayInput
 * @param {string} inputNamesMap.monthInput
 * @param {string} inputNamesMap.yearInput
 * @param {string} inputNamesMap.inputPrefix
 * @param {string} messagePrefix
 * @return {*}
 */
export const dateReceivedValidator = (inputNamesMap, messagePrefix) => {
	return createValidator(validateDateIsNotInTheFuture(inputNamesMap, messagePrefix));
};
