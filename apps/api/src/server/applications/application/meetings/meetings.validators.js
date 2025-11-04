import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';

export const validateCreateMeeting = composeMiddleware(
	body('agenda').exists({ checkFalsy: true }).withMessage('Agenda is required.'),
	body('pinsRole')
		.isIn(['Facilitator', 'Advisor', 'Observer'])
		.withMessage('pinsRole must be Facilitator, Advisor, or Observer.'),
	body('meetingDate')
		.optional()
		.isISO8601()
		.withMessage('meetingDate must be a valid ISO 8601 date-time.'),
	validationErrorHandler
);

export const validatePatchMeeting = composeMiddleware(
	body('pinsRole')
		.optional()
		.isIn(['Facilitator', 'Advisor', 'Observer'])
		.withMessage('pinsRole must be Facilitator, Advisor, or Observer.'),
	body('meetingDate')
		.optional()
		.isISO8601()
		.withMessage('meetingDate must be a valid ISO 8601 date-time.'),
	validationErrorHandler
);
