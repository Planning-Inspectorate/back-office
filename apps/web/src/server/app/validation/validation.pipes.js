import { body } from 'express-validator';

// All validation pipes will save into the current request all the validation errors that would be used
// by the `expressValidationErrorsInterceptor` to populate the body with.

/**
 * Validate the apeal outcome form that it has at least 1 answer.
 *
 * @returns {void}
 */
export const validateOutcomePipe = () =>
	body('review-outcome')
		.notEmpty()
		.withMessage('Select if the appeal is valid or invalid, or if something is missing or wrong')
		.bail()
		.isIn(['valid', 'invalid', 'incomplete'])
		.withMessage('Select if the appeal is valid or invalid, or if something is missing or wrong');

/**
 * Validate the apeal details form that it has content and it doesn't exceed 500 chars.
 *
 * @returns {void}
 */
export const validateValidAppealDetails = () =>
	body('valid-appeal-details')
		.notEmpty()
		.withMessage('Enter a description of development')
		.bail()
		.isLength({ max: 500 })
		.withMessage('Word count exceeded');
