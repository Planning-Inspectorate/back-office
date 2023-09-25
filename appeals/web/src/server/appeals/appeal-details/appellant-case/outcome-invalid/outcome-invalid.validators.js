import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { createCheckboxTextItemsValidator } from '../../../../lib/validators/checkbox-text-items.validator.js';

export const validateInvalidReason = createValidator(
	body('invalidReason')
		.exists()
		.withMessage('Please select one or more reasons why the appeal is invalid')
		.bail()
		.notEmpty()
		.withMessage('Please select one or more reasons why the appeal is invalid') /*,
	body()
		.custom((bodyFields) => {
			for (const reasonId of bodyFields.invalidReason || []) {
				let reasonText = bodyFields?.[`invalidReason-${reasonId}`];

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

export const validateInvalidReasonTextItems = createCheckboxTextItemsValidator('invalidReason');
