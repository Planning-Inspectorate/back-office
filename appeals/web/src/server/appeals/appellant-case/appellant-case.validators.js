import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateReviewOutcome = createValidator(
	body('reviewOutcome').trim().notEmpty().withMessage('Please select an outcome')
);
