import { composeMiddleware } from '@pins/express';
import { body, param, query } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';

export const validateGetSubscription = composeMiddleware(
	query('caseReference').notEmpty().withMessage(`caseReference is required`),
	query('emailAddress').notEmpty().withMessage(`emailAddress is required`),
	validationErrorHandler
);

export const validateCreateSubscription = composeMiddleware(
	body('caseReference')
		.notEmpty()
		.withMessage('caseReference is required')
		.isString()
		.withMessage('caseReference must be a string'),
	body('emailAddress')
		.notEmpty()
		.withMessage('emailAddress is required')
		.isString()
		.withMessage('emailAddress must be a string')
		.isEmail({
			allow_display_name: false,
			require_tld: true,
			allow_ip_domain: false
		})
		.withMessage('emailAddress must be a valid email address'),
	body('subscriptionTypes')
		.notEmpty()
		.withMessage('subscriptionTypes is required')
		.isArray({ min: 1 })
		.withMessage('subscriptionTypes must be an array')
		.custom((values) => values.every(validateSubscriptionType))
		.withMessage(
			`subscriptionTypes must be one of 'allUpdates', 'applicationSubmitted', 'applicationDecided', 'registrationOpen'`
		),
	body('startDate')
		.optional()
		.isISO8601({ strict: true, strictSeparator: true })
		.withMessage(`startDate must be a valid date`),
	body('endDate')
		.optional()
		.isISO8601({ strict: true, strictSeparator: true })
		.withMessage(`endDate must be a valid date`)
		.custom((_, { req: { body } }) => validateStartBeforeEnd(body['startDate'], body['endDate']))
		.withMessage(`startDate must be before endDate`),
	body('language')
		.optional()
		.isString()
		.withMessage('language must be a string')
		.isIn(['English', 'Welsh'])
		.withMessage(`language must be one of 'English', 'Welsh'`),
	validationErrorHandler
);

export const validateUpdateSubscription = composeMiddleware(
	param('id').notEmpty().withMessage(`id is required`),
	body('endDate')
		.isISO8601({ strict: true, strictSeparator: true })
		.withMessage(`endDate must be a valid date`),
	validationErrorHandler
);

/**
 * Is start before end?
 *
 * @param {string|undefined} startDate
 * @param {string|undefined} endDate
 * @returns {boolean}
 */
function validateStartBeforeEnd(startDate, endDate) {
	if (!startDate || !endDate) {
		return true; // both fields are optional, so this is valid
	}
	// if both present, check start is before end
	const start = new Date(startDate);
	const end = new Date(endDate);
	return start < end;
}

const subscriptionTypes = [
	'allUpdates',
	'applicationSubmitted',
	'applicationDecided',
	'registrationOpen'
];
/**
 * @param {string} v
 * @returns {boolean}
 */
function validateSubscriptionType(v) {
	return subscriptionTypes.includes(v);
}
