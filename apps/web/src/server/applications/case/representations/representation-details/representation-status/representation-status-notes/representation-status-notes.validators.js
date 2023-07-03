import { body } from 'express-validator';
import { createValidator } from '@pins/express';

const validateStatusChange = createValidator(
	body('statusResult').exists().withMessage('Select one option')
);

export const representationStatusNotesValidation = [validateStatusChange];
