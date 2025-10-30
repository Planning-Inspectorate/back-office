import { body } from 'express-validator';
import { createValidator } from '@pins/express';

const validateRepresentation = createValidator(
	body('editedRepresentation').trim().notEmpty().withMessage('Enter representation content')
);

export const editRepresentationValidation = [validateRepresentation];
