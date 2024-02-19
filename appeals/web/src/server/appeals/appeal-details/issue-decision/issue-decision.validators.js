import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	createDateInputFieldsValidator,
	createDateInputDateValidityValidator,
	createDateInputDateInFutureValidator,
	createDateInputDateInPastOrTodayValidator
} from '#lib/validators/date-input.validator.js';
import { createTextareaValidator } from '#lib/validators/textarea-validator.js';
// import { createCheckboxTextItemsValidator } from '../../../../lib/validators/checkbox-text-items.validator.js';

// export const validateIncompleteReason = createValidator(
// 	body('incompleteReason')
// 		.exists()
// 		.withMessage('Please select one or more reasons why the appeal is incomplete')
// 		.bail()
// 		.notEmpty()
// 		.withMessage('Please select one or more reasons why the appeal is incomplete')
// );

// export const validateIncompleteReasonTextItems = createCheckboxTextItemsValidator(
// 	'incompleteReason',
// 	'appellantCaseNotValidReason'
// );
export const validateDueDateFields = createDateInputFieldsValidator('due-date');
export const validateDueDateValid = createDateInputDateValidityValidator('due-date');
export const validateDueDateInFuture = createDateInputDateInFutureValidator('due-date');
export const validateTextArea = createTextareaValidator(
	'decision-invalid-reason',
	'Text must not exceed {{maximumCharacters}} characters',
	1000
);

export const validateDecision = createValidator(
	body('decision').trim().notEmpty().withMessage('Please issue a decision')
);

export const validateDecisionLetterDate = createValidator(
	body('decision-letter-date')
		.trim()
		.notEmpty()
		.withMessage('Please tell us the date on your decision letter')
);
export const validateVisitDateFields = createDateInputFieldsValidator(
	'decision-letter-date',
	'decision letter date'
);
export const validateVisitDateValid = createDateInputDateValidityValidator(
	'decision-letter-date',
	'decision letter date'
);
export const validateDueDateInPastOrToday =
	createDateInputDateInPastOrTodayValidator('decision-letter-date');

export const validateCheckDecision = createValidator(
	body('ready-to-send')
		.trim()
		.notEmpty()
		.withMessage('Please confirm that the decision is ready to be sent to all parties')
);
