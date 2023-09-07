import { createValidator } from '@pins/express';
import {
	validationDateFuture,
	validationDateValid
} from '../../common/validators/dates.validators.js';

/**
 * Validator for key dates
 *
 * @type {import('express').RequestHandler}
}
 */
export const validateApplicationsCreateKeyDates = (request, response, next) => {
	const fieldName = 'keyDates.preApplication.submissionAtInternal';
	const extendedFieldName = 'anticipated submission date internal';

	const checkValidDate = validationDateValid({ fieldName, extendedFieldName }, request.body);

	const checkFutureDate = validationDateFuture(
		{ fieldName, extendedFieldName },
		request.body,
		true,
		true
	);

	return createValidator([checkValidDate, checkFutureDate])(request, response, next);
};
