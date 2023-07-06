import { body } from 'express-validator';
import { createValidator } from '@pins/express';

const validateStatusChange = createValidator(
	body('statusResult').custom((value, { req: { query } }) => {
		const newStatus = query?.changeStatus;

		if (!value) {
			//radio items are not rendered for those statuses and validation can be skipped
			if (newStatus === 'WITHDRAWN' || newStatus === 'AWAITING_REVIEW') {
				return true;
			}
			throw new Error(`Select one option`);
		}

		return true;
	})
);

export const representationStatusNotesValidation = [validateStatusChange];
