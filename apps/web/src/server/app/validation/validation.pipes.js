import { body } from 'express-validator';

/**
 * Validate the apeal outcome form that it has at least 1 answer.
 * It will save into the current request all the validation errors that would be used
 * by the `expressValidationErrorsInterceptor` to populate the body with.
 *
 * @returns {void}
 */
export const validateOutcomePipe = () =>
	body('review-outcome')
		.notEmpty()
		.withMessage('Select if the appeal is valid or invalid, or if something is missing or wrong')
		.bail()
		.isIn([1, 2, 3])
		.withMessage('Select if the appeal is valid or invalid, or if something is missing or wrong');
