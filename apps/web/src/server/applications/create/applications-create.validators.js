import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsCreateSector = createValidator(
	body('sector').trim().isLength({ min: 1 }).withMessage('Select a sector')
);
