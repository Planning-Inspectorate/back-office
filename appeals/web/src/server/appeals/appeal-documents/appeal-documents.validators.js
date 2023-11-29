import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { createDateInputFieldsValidator } from '#lib/validators/date-input.validator.js';
import { dateIsValid } from '#lib/dates.js';

export const validateDocumentDetailsBodyFormat = createValidator(
	body()
		.custom((bodyFields) => {
			if (
				!('items' in bodyFields) ||
				!Array.isArray(bodyFields.items) ||
				!(bodyFields.items.length > 0)
			) {
				return false;
			}

			for (const item of bodyFields.items) {
				if (!('documentId' in item) || !('receivedDate' in item)) {
					return false;
				}
			}

			return true;
		})
		.withMessage('There is a problem with the service')
);

export const validateDocumentDetailsReceivedDatesFields = createDateInputFieldsValidator(
	'items.*.receivedDate',
	'Received date',
	'[day]',
	'[month]',
	'[year]'
);

export const validateDocumentDetailsReceivedDateValid = createValidator(
	body()
		.custom((bodyFields) => {
			for (const item of bodyFields.items) {
				const day = item?.receivedDate?.day;
				const month = item?.receivedDate?.month;
				const year = item?.receivedDate?.year;

				if (!day || !month || !year) {
					return false;
				}

				const dayNumber = Number.parseInt(day, 10);
				const monthNumber = Number.parseInt(month, 10);
				const yearNumber = Number.parseInt(year, 10);

				if (!dateIsValid(yearNumber, monthNumber, dayNumber)) {
					return false;
				}
			}

			return true;
		})
		.withMessage('Received date must be a valid date')
);

export const validateDocumentDetailsReceivedDateIsNotFutureDate = createValidator(
	body()
		.custom((bodyFields) => {
			for (const item of bodyFields.items) {
				const day = item?.receivedDate?.day;
				const month = item?.receivedDate?.month;
				const year = item?.receivedDate?.year;

				if (!day || !month || !year) {
					return false;
				}

				const dayNumber = Number.parseInt(day, 10);
				const monthNumber = Number.parseInt(month, 10);
				const yearNumber = Number.parseInt(year, 10);

				const inputDate = new Date(yearNumber, monthNumber - 1, dayNumber);
				const todayDate = new Date();

				const deserializedInputDate = new Date(
					Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate())
				);
				const deserializedTodayDate = new Date(
					Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
				);

				if (deserializedInputDate > deserializedTodayDate) {
					return false;
				}
			}

			return true;
		})
		.withMessage('Received date cannot be a future date')
);
export const validateDocumentDetailsRedactionStatuses = createValidator(
	body()
		.custom((bodyFields) => {
			for (const item of bodyFields.items) {
				if (!item?.redactionStatus) {
					return false;
				}
			}

			return true;
		})
		.withMessage('Please provide a redaction status for every document listed')
);
