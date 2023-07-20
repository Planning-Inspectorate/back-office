import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const TEXTAREA_MAXIMUM_CHARACTERS = 88000;

export const createTextareaValidator = (
	fieldName = 'textarea',
	maxCharactersErrorMessage = 'Text must not exceed {{maximumCharacters}} characters'
) =>
	createValidator(
		body(fieldName)
			.trim()
			.isLength({ max: TEXTAREA_MAXIMUM_CHARACTERS })
			.withMessage(
				maxCharactersErrorMessage.replace(
					'{{maximumCharacters}}',
					String(TEXTAREA_MAXIMUM_CHARACTERS)
				)
			)
	);
