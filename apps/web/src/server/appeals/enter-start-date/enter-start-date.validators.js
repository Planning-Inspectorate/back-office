import { createValidator } from '@pins/express';
import { body } from 'express-validator';

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
			const date = new Date(year, Number.parseInt(month, 10) - 1, day);

			return (
				date.getDate() === Number(day) &&
				date.getMonth() + 1 === Number(month) &&
				date.getFullYear() === Number(year) &&
				!Number.isNaN(date.getTime())
			);
		})
		.withMessage('Please enter a valid date')
		.bail()
);
