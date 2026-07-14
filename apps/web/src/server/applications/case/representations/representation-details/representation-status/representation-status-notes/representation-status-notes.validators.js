import { body } from 'express-validator';
import { createValidator } from '@pins/express';
import { NOTES_CHARACTER_LIMIT } from './representation-status-notes.constants.js';

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

const validateNotes = createValidator(
	body('notes')
		.optional({ checkFalsy: true })
		.isLength({ max: NOTES_CHARACTER_LIMIT })
		.withMessage(`Notes must be ${NOTES_CHARACTER_LIMIT} characters or fewer`)
);

export const representationStatusNotesValidation = [validateStatusChange, validateNotes];
