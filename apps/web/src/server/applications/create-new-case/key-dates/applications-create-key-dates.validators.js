import { createValidator } from '@pins/express';
import {
	createValidationDateFuture,
	createValidationDateValid
} from '../../common/validators/dates.validators.js';

/**
 * Validator for key dates
 *
 * @type {import('express').RequestHandler}
}
 */
export const validateApplicationsCreateKeyDates = (request, response, next) => {
	const fieldName = 'keyDates.submissionDateInternal';
	const extendedFieldName = 'anticipated submission date internal';

	const {
		submissionInternalDay: day,
		submissionInternalMonth: month,
		submissionInternalYear: year
	} = request.body;

	const checkValidDate = createValidationDateValid(fieldName, extendedFieldName, {
		day,
		month,
		year
	});

	const checkFutureDate = createValidationDateFuture(
		fieldName,
		extendedFieldName,
		{
			day,
			month,
			year
		},
		true
	);

	return createValidator([checkValidDate, checkFutureDate])(request, response, next);
};
