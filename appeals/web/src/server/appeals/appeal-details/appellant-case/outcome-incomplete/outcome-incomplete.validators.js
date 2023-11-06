import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	createDateInputFieldsValidator,
	createDateInputDateValidityValidator,
	createDateInputDateInFutureValidator
} from '#lib/validators/date-input.validator.js';
import { createCheckboxTextItemsValidator } from '../../../../lib/validators/checkbox-text-items.validator.js';

export const validateIncompleteReason = createValidator(
	body('incompleteReason')
		.exists()
		.withMessage('Please select one or more reasons why the appeal is incomplete')
		.bail()
		.notEmpty()
		.withMessage('Please select one or more reasons why the appeal is incomplete')
);

export const validateIncompleteReasonTextItems = createCheckboxTextItemsValidator(
	'incompleteReason',
	'appellantCaseNotValidReason'
);
export const validateDueDateFields = createDateInputFieldsValidator('due-date');
export const validateDueDateValid = createDateInputDateValidityValidator('due-date');
export const validateDueDateInFuture = createDateInputDateInFutureValidator('due-date');
