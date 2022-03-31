import { body } from 'express-validator';

// All validation pipes will save into the current request all the validation errors that would be used
// by the `expressValidationErrorsInterceptor` to populate the body with.

/**
 * Validate the questionnaire form to ensure any items marked as missing or incorrect have details provided, if there is a details field provided
 *
 * @returns {void}
 */
export const validateQuestionnairePipe = () => [
	body('plans-used-to-reach-decision-missing-or-incorrect-reason')
		.if(body('plans-used-to-reach-decision-missing-or-incorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('statutory-development-plan-policies-missing-or-incorrect-reason')
		.if(body('statutory-development-plan-policies-missing-or-incorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('other-relevant-policies-missing-or-incorrect-reason')
		.if(body('other-relevant-policies-missing-or-incorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('supplementary-planning-documents-missing-or-incorrect-reason')
		.if(body('supplementary-planning-documents-missing-or-incorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('conservation-area-guidance-missing-or-incorrect-reason')
		.if(body('conservation-area-guidance-missing-or-incorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('listed-building-description-missing-or-incorrect-reason')
		.if(body('listed-building-description-missing-or-incorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('application-notification-missing-or-incorrect-reason')
		.if(body('application-notification-missing-or-incorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong'),
	body('representations-missing-or-incorrect-reason')
		.if(body('representations-missing-or-incorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded'),
	body('appeal-notification-missing-or-incorrect-reason')
		.if(body('appeal-notification-missing-or-incorrect').notEmpty())
		.notEmpty()
		.withMessage('Please provide details describing what is missing or wrong')
];
