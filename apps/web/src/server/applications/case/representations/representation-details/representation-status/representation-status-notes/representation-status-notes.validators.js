import { body } from 'express-validator';
import { createValidator } from '@pins/express';

const validateStatusChange = createValidator(
	body('statusResult').custom((value, { req: { query } }) => {
		const newStatus = query?.changeStatus;

		if (!value) {
			//radio items are not rendered for those statuses and validation can be skipped
			if (newStatus === 'WITHDRAWN' || newStatus === 'AWAITING_REVIEW') {
				return true;
			} else if (newStatus === 'REFERRED') {
				throw new Error(`Select who you are referring the representation to`);
			} else if (newStatus === 'INVALID') {
				throw new Error(`Select the reason why the representation is invalid`);
			}
		}

		return true;
	})
);

export const representationStatusNotesValidation = [validateStatusChange];
