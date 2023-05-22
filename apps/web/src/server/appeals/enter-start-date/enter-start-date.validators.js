import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { dateIsValid } from '../../lib/dates.js';

export const validateStartDateFields = createValidator(
	body('start-date-day')
		.trim()
		.notEmpty()
		.withMessage('Day cannot be empty')
		.bail()
		.isInt()
		.withMessage('Day must be a number')
		.bail()
		.isLength({ min: 1, max: 2 })
		.withMessage('Day must be 1 or 2 digits')
		.bail()
		.matches(/^0?[1-9]$|^1\d$|^2\d$|^3[01]$/)
		.withMessage('Day must be between 1 and 31'),
	body('start-date-month')
		.trim()
		.notEmpty()
		.withMessage('Month cannot be empty')
		.bail()
		.isInt()
		.withMessage('Month must be a number')
		.bail()
		.isLength({ min: 1, max: 2 })
		.withMessage('Month must be 1 or 2 digits')
		.bail()
		.matches(/^0?[1-9]$|^1[0-2]$/)
		.withMessage('Month must be between 1 and 12'),
	body('start-date-year')
		.trim()
		.notEmpty()
		.withMessage('Year cannot be empty')
		.bail()
		.isInt()
		.withMessage('Year must be a number')
		.bail()
		.isLength({ min: 4, max: 4 })
		.withMessage('Year must be 4 digits')
);

export const validateWholeStartDate = createValidator(
	body()
		.custom((bodyFields) => {
			const day = bodyFields['start-date-day'];
			const month = bodyFields['start-date-month'];
			const year = bodyFields['start-date-year'];

			if (!day || !month || !year) {
				return false;
			}

			const dayNumber = Number.parseInt(day, 10);
			const monthNumber = Number.parseInt(month, 10);
			const yearNumber = Number.parseInt(year, 10);

			return dateIsValid(yearNumber, monthNumber, dayNumber);
		})
		.withMessage('Please enter a valid date')
);
