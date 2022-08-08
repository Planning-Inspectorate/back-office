import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { dateIsValid } from '../../../lib/dates.js';

export const validateApplicationsCreateKeyDates = createValidator(
	body('keyDates.firstNotifiedDate')
		.custom((value, { req }) => {
			const { firstNotifiedDay } = req.body;

			return (
				firstNotifiedDay === '' ||
				(Number.parseInt(firstNotifiedDay, 10) > 0 && Number.parseInt(firstNotifiedDay, 10) < 32)
			);
		})
		.withMessage('Enter a valid day for the first notified date')
		.custom((value, { req }) => {
			const { firstNotifiedMonth } = req.body;

			return (
				firstNotifiedMonth === '' ||
				(Number.parseInt(firstNotifiedMonth, 10) > 0 &&
					Number.parseInt(firstNotifiedMonth, 10) < 13)
			);
		})
		.withMessage('Enter a valid month for the first notified date')
		.custom((value, { req }) => {
			const { firstNotifiedYear } = req.body;

			return firstNotifiedYear === '' || `${firstNotifiedYear}`.length === 4;
		})
		.withMessage('Enter a valid year for the first notified date')
		.custom((value, { req }) => {
			const { firstNotifiedDay, firstNotifiedMonth, firstNotifiedYear } = req.body;

			return (
				(firstNotifiedYear === '' && firstNotifiedYear === '' && firstNotifiedMonth === '') ||
				dateIsValid(firstNotifiedYear, firstNotifiedMonth, firstNotifiedDay)
			);
		})
		.withMessage('Enter a valid first notified date'),
	body('keyDates.submissionDate')
		.custom((value, { req }) => {
			const { submissionDay } = req.body;

			return (
				submissionDay === '' ||
				(Number.parseInt(submissionDay, 10) > 0 && Number.parseInt(submissionDay, 10) < 32)
			);
		})
		.withMessage('Enter a valid day for the submission date')
		.custom((value, { req }) => {
			const { submissionMonth } = req.body;

			return (
				submissionMonth === '' ||
				(Number.parseInt(submissionMonth, 10) > 0 && Number.parseInt(submissionMonth, 10) < 13)
			);
		})
		.withMessage('Enter a valid month for the submission date')
		.custom((value, { req }) => {
			const { submissionYear } = req.body;

			return submissionYear === '' || `${submissionYear}`.length === 4;
		})
		.withMessage('Enter a valid year for the submission date')
		.custom((value, { req }) => {
			const { submissionDay, submissionMonth, submissionYear } = req.body;

			return (
				(submissionDay === '' && submissionMonth === '' && submissionYear === '') ||
				dateIsValid(submissionYear, submissionMonth, submissionDay)
			);
		})
		.withMessage('Enter a valid submission date')
		.custom((value, { req }) => {
			const { submissionDay, submissionMonth, submissionYear } = req.body;
			const submissionDate = new Date(submissionYear, submissionMonth, submissionDay);

			return (
				(submissionDay === '' && submissionMonth === '' && submissionYear === '') ||
				submissionDate > new Date()
			);
		})
		.withMessage('The submission date should be in the future')
);
