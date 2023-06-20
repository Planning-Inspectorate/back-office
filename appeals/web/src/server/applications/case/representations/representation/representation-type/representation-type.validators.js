import { body } from 'express-validator';
import { createValidator } from '@pins/express';

const validateType = createValidator(body('type').exists().withMessage('Select one option'));

export const representationTypeValidation = [validateType];
