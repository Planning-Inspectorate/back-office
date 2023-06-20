import { body } from 'express-validator';
import { createValidator } from '@pins/express';

const validateRepresentationEntity = createValidator(
	body('representationEntity').exists().withMessage('Select one option')
);

export const representationEntityValidation = [validateRepresentationEntity];
