import { body } from 'express-validator';
import { createValidator } from '@pins/express';

const validateRadio = createValidator(
	body('changeRedaction').exists().withMessage('Select one option')
);

export const representationChangeRedactionValidation = [validateRadio];
