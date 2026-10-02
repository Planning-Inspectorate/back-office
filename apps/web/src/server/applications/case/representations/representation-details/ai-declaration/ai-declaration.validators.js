import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const aiDeclarationValidation = createValidator(
	body('useOfAI')
		.notEmpty()
		.withMessage('Select the AI declaration status')
		.isIn(['YES', 'NO', 'UNKNOWN'])
		.withMessage('Select the AI declaration status')
);
