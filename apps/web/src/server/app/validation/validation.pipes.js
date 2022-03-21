import { body } from 'express-validator';

// All validation pipes will save into the current request all the validation errors that would be used
// by the `expressValidationErrorsInterceptor` to populate the body with.

/**
 * Validate the appeal outcome form to ensure it has at least 1 answer.
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

/**
 * Validate the outcome incomplete form to ensure it has at least 1 answer.
 * If "missing or incorrect documents" is checked, validate missingOrWrongDocumentsReason to ensure a reason has been selected.
 * If "other" is checked, validate otherReason to ensure a reason has been provided.
 * It will save into the current request all the validation errors that would be used
 * by the `expressValidationErrorsInterceptor` to populate the body with.
 *
 * @returns {void}
 */
export const validateOutcomeIncompletePipe = () => [
	body('incompleteReason')
		.notEmpty()
		.withMessage('Please select one or more reasons for the incomplete outcome')
		.bail()
		.isIn([1, 2, 3, 4, 5, 6, 7])
		.withMessage('Please select one or more reasons for the incomplete outcome'),
	body('missingOrWrongDocumentsReason')
		.if(body('incompleteReason').isIn([3]))
		.notEmpty()
		.withMessage('Please select which documents are missing or wrong')
		.bail()
		.isIn([1, 2, 3, 4])
		.withMessage('Please select which documents are missing or wrong'),
	body('otherReason')
		.if(body('incompleteReason').isIn([7]))
		.notEmpty()
		.withMessage('Please provide a reason for the incomplete outcome')
];
