import { body } from 'express-validator';

// All validation pipes will save into the current request all the validation errors that would be used
// by the `expressValidationErrorsInterceptor` to populate the body with.

/**
 * Validate the appeal outcome form to ensure it has at least 1 answer.
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
 * If "missing or incorrect documents" is checked, validate MissingOrWrongDocsReasons to ensure a reason has been selected.
 * If "OtherReason" is checked, validate OtherReasons to ensure a reason has been provided.
 * It will save into the current request all the validation errors that would be used
 * by the `expressValidationErrorsInterceptor` to populate the body with.
 *
 * @returns {void}
 */
export const validateOutcomeIncompletePipe = () => [
	body('incompleteReasons')
		.notEmpty()
		.withMessage('Please enter a reason why the appeal is missing or wrong')
		.bail()
		.toArray()
		.isIn([
			'NamesDoNotMatch',
			'Sensitiveinfo',
			'MissingOrWrongDocs',
			'InflamatoryComments',
			'OpenedInError',
			'WrongAppealType',
			'OtherReason'
		])
		.withMessage('Please enter a reason why the appeal is missing or wrong'),
	body('MissingOrWrongDocsReasons')
		.if(body('incompleteReasons').isIn(['MissingOrWrongDocs']))
		.notEmpty()
		.withMessage('Please select which documents are missing or wrong')
		.bail()
		.toArray()
		.isIn(['applicationForm', 'decisionNotice', 'groundsOfAppeal', 'supportingDocuments'])
		.withMessage('Please select which documents are missing or wrong'),
	body('OtherReasons')
		.if(body('incompleteReasons').toArray().custom((value) => value.includes('OtherReason')))
		.notEmpty()
		.withMessage('Please provide a reason for the incomplete outcome')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded')
];

/**
 * Validate the outcome incomplete form to ensure it has at least 1 answer.
 *
 * @returns {void}
 */
export const validateOutcomeInvalidReason = () => [
	body('invalidReasons')
		.notEmpty()
		.withMessage('Please select a reason why the appeal is invalid')
		.bail()
		.isIn([
			'OutOfTime',
			'NoRightOfappeal',
			'NotAppealable',
			'LPADeemedInvalid',
			'OtherReason'
		])
		.withMessage('Please enter a reason why the appeal is invalid'),
	body('OtherReasons')
		.if(body('invalidReasons').toArray().custom((value) => value.includes('OtherReason')))
		.notEmpty()
		.withMessage('Please provide a reason for the invalid outcome')
		.bail()
		.isLength({ min: 1, max: 500 })
		.withMessage('Word count exceeded')
];

/**
 * Validate the check and confirm step.
 *
 * @returns {void}
 */
export const validateCheckAndConfirmPipe = () =>
	body('check-and-confirm-completed').custom((value, { req }) => {
		const { appealWork = {} } = req.session;

		if (appealWork.reviewOutcome === 'incomplete' && value !== 'true') {
			throw new Error('Confirm if you have completed all follow-up tasks and emails');
		}

		return true;
	});
