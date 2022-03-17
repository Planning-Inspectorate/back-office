import { validationResult } from 'express-validator';

/**
 * This function gets all the errors (added by express-validator checks) from the request
 * and adds them to the body using 2 important keys:
 * - errors - An object where the keys are the field names, and the values are the validation errors used by form elements to display errors
 * - errorSummary - An array off all the errors used by the GOCUK error-summary component to be displayed on top of the page
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 */
export const expressValidationErrorsInterceptor = (request, response, next) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		request.body.errors = errors.mapped();
		request.body.errorSummary = errors.errors.map(({ msg, param }) => ({
			text: msg,
			href: `#${param}`
		}));
	}

	next();
};
