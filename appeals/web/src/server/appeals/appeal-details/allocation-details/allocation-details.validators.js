import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateAllocationDetailsLevels = createValidator(
	body('allocation-level').trim().notEmpty().withMessage('Allocation level must be provided')
);

export const validateAllocationDetailsSpecialisms = createValidator(
	body('allocation-specialisms')
		.exists()
		.withMessage('Please select one or more allocation specialisms')
		.bail()
		.notEmpty()
		.withMessage('Please select one or more allocation specialisms')
);
