import { createValidator } from '@pins/express';
import { body } from 'express-validator';

const validaterepresentationId = createValidator(
	body('representationId').notEmpty().withMessage('You must select representations to publish')
);

export const publishUpdatedRepresentationsValidation = [validaterepresentationId];
