import { body } from 'express-validator';
import { createValidator } from '@pins/express';
import { isLeapYear } from 'date-fns';

const errorMessages = {
	realDate: 'The date must be a real date',
	mustInclude: 'The date must include a '
};

/**
 *
 * @param {object} receivedDateKeys
 * @param {string} receivedDateKeys.dayInput
 * @param {string} receivedDateKeys.monthInput
 * @param {string} receivedDateKeys.yearInput
 * @param {string} receivedDateKeys.dateInputContainerId
 * @returns
 */
export const dateValidator = ({ dayInput, monthInput, yearInput, dateInputContainerId }) => {
	return createValidator(
		body(dateInputContainerId).custom((_, { req: { body } }) => {
			if (!body[dayInput] && !body[monthInput] && !body[yearInput]) {
				throw new Error(`Enter the date`);
			}
			return true;
		}),

		body(dayInput)
			.notEmpty()
			.withMessage((_, { req: { body } }) => {
				if (!body[monthInput] && body[yearInput]) {
					return errorMessages.mustInclude + 'day and month';
				}
				if (!body[dayInput] && body[monthInput] && !body[yearInput]) {
					return errorMessages.mustInclude + 'day and year';
				}

				return errorMessages.mustInclude + 'day';
			}),

		body(monthInput)
			.notEmpty()
			.withMessage((_, { req: { body } }) => {
				if (body[dayInput] && !body[monthInput] && !body[yearInput]) {
					return errorMessages.mustInclude + 'month and year';
				}
				return errorMessages.mustInclude + 'month';
			}),

		body(yearInput)
			.notEmpty()
			.withMessage(errorMessages.mustInclude + 'year'),

		body(dayInput)
			.isInt({ min: 1, max: 31 })
			.withMessage(errorMessages.realDate)
			.bail()
			.toInt()
			.custom((value, { req }) => {
				const monthNum = parseInt(req.body[monthInput], 10);
				if (value === 31 && monthNum && [4, 6, 9, 11].includes(monthNum)) return false;

				if (value > 28 && monthNum && monthNum === 2) {
					const yearNum = parseInt(req.body[yearInput], 10);
					return yearNum && isLeapYear(new Date(yearNum, 1, 1)) && value === 29;
				}

				return true;
			})
			.withMessage(errorMessages.realDate),

		body(monthInput).isInt({ min: 1, max: 12 }).withMessage(errorMessages.realDate),
		body(yearInput).isInt({ min: 1000, max: 9999 }).withMessage(errorMessages.realDate)
	);
};
