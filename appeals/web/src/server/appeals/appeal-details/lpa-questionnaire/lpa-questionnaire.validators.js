import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateReviewOutcome = createValidator(
	body('review-outcome').trim().notEmpty().withMessage('Review outcome must be provided')
);
