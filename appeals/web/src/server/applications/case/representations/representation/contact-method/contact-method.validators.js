import { body } from 'express-validator';
import { createValidator } from '@pins/express';

const validateContactMethod = createValidator(
	body('contactMethod').exists().withMessage('Select one option')
);

export const contactMethodValidation = [validateContactMethod];
