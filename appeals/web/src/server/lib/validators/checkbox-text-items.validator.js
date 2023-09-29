import { createValidator } from '@pins/express';
import { body } from 'express-validator';

/**
 *
 * @param {string} checkboxIdsBodyKey
 * @returns
 */
export const createCheckboxTextItemsValidator = (checkboxIdsBodyKey) =>
	createValidator(
		body()
			.custom((bodyFields) => {
				let checkboxIds = bodyFields[checkboxIdsBodyKey];

				if (!Array.isArray(checkboxIds)) {
					checkboxIds = [checkboxIds];
				}

				for (const checkboxId of checkboxIds || []) {
					let textItemsForId = bodyFields?.[`${checkboxIdsBodyKey}-${checkboxId}`];

					if (typeof textItemsForId === 'undefined') {
						continue;
					}

					if (
						textItemsForId.length === 0 ||
						(Array.isArray(textItemsForId) &&
							textItemsForId.filter((textItem) => textItem.length > 0).length === 0)
					) {
						return false;
					}
				}

				return true;
			})
			.withMessage(
				'All selected checkboxes with text fields must have at least one reason provided'
			)
	);
