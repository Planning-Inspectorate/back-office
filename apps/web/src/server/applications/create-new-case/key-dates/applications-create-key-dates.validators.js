import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { dateIsValid } from '../../../lib/dates.js';

export const validateApplicationsCreateKeyDates = createValidator(
	body('keyDates.submissionDateInternal')
		.custom((value, { req }) => {
			const { submissionInternalDay } = req.body;

			return (
				submissionInternalDay === '' ||
				(Number.parseInt(submissionInternalDay, 10) > 0 &&
					Number.parseInt(submissionInternalDay, 10) < 32)
			);
		})
		.withMessage('Enter a valid day for the anticipated submission date internal')
		.custom((value, { req }) => {
			const { submissionInternalMonth } = req.body;

			return (
				submissionInternalMonth === '' ||
				(Number.parseInt(submissionInternalMonth, 10) > 0 &&
					Number.parseInt(submissionInternalMonth, 10) < 13)
			);
		})
		.withMessage('Enter a valid month for the anticipated submission date internal')
		.custom((value, { req }) => {
			const { submissionInternalYear } = req.body;

			return submissionInternalYear === '' || `${submissionInternalYear}`.length === 4;
		})
		.withMessage('Please check the year of the date of the anticipated submission date internal')
		.custom((value, { req }) => {
			const { submissionInternalDay, submissionInternalMonth, submissionInternalYear } = req.body;

			return (
				(submissionInternalDay === '' &&
					submissionInternalMonth === '' &&
					submissionInternalMonth === '') ||
				dateIsValid(submissionInternalYear, submissionInternalMonth, submissionInternalDay)
			);
		})
		.withMessage('Enter a valid submission date')
		.custom((value, { req }) => {
			const { submissionInternalDay, submissionInternalMonth, submissionInternalYear } = req.body;
			const submissionInternalDate = new Date(
				submissionInternalYear,
				Number.parseInt(submissionInternalMonth, 10) - 1,
				submissionInternalDay
			);

			return (
				(submissionInternalDay === '' &&
					submissionInternalMonth === '' &&
					submissionInternalYear === '') ||
				submissionInternalDate > new Date()
			);
		})
		.withMessage('The anticipated submission date internal must be in the future')
);
