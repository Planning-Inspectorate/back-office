import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { createDateInputValidator } from '../../../../lib/validators/date-input.validator.js';
import { createCheckboxTextItemsValidator } from '../../../../lib/validators/checkbox-text-items.validator.js';

export const validateIncompleteReason = createValidator(
	body('incompleteReason')
		.exists()
		.withMessage('Please select one or more reasons why the appeal is incomplete')
		.bail()
		.notEmpty()
		.withMessage('Please select one or more reasons why the appeal is incomplete') /*,
	body()
		.custom((bodyFields) => {
			for (const reasonId of bodyFields.incompleteReason || []) {
				let reasonText = bodyFields?.[`incompleteReason-${reasonId}`];

				if (typeof reasonText === 'undefined') {
					continue;
				}

				if (
					reasonText.length === 0 ||
					(Array.isArray(reasonText) &&
						reasonText.filter((reasonTextItem) => reasonTextItem.length > 0).length === 0)
				) {
					return false;
				}
			}

			return true;
		})
		.withMessage('All selected checkboxes with text fields must have at least one reason provided')*/
);

export const validateIncompleteReasonTextItems =
	createCheckboxTextItemsValidator('incompleteReason');
export const validateUpdateDueDate = createDateInputValidator('due-date');
