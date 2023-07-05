import { body } from 'express-validator';
import { createValidator } from '@pins/express';

const validateStatusChange = createValidator(
	body('changeStatus').exists().withMessage('Select one option')
);

export const representationStatusValidation = [validateStatusChange];
