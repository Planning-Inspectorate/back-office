import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateUnlinkAppeal = createValidator(
	body('unlinkAppeal').trim().notEmpty().withMessage('Please choose an option')
);
