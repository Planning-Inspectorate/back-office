import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import dateIsValid from '../../lib/validation/date-is-valid.js';

export const validateEnteredStartDate = createValidator(
	body('start-date-day')
		.trim()
		.isInt()
		.isLength({ min: 1, max: 2 })
		.matches(/^0?[1-9]$|^1\d$|^2\d$|^3[01]$/)
		.withMessage('Please enter a valid day')
		.bail(),
	body('start-date-month')
		.trim()
		.isInt()
		.isLength({ min: 1, max: 2 })
		.matches(/^0?[1-9]$|^1[0-2]$/)
		.withMessage('Please enter a valid month')
		.bail(),
	body('start-date-year')
		.trim()
		.isInt()
		.isLength({ min: 4, max: 4 })
		.matches(/^(2\d)\d{2}$/)
		.withMessage('Please enter a valid year')
		.bail(),
	body()
		.custom((bodyFields) => {
			const day = bodyFields['start-date-day'];
			const month = bodyFields['start-date-month'];
			const year = bodyFields['start-date-year'];

			if (!day || !month || !year) {
				return false;
			}

			return dateIsValid(day, month, year);
		})
		.withMessage('Please enter a valid date')
		.bail()
);
