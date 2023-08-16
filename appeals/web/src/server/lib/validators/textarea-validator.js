import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const TEXTAREA_MAXIMUM_CHARACTERS = 4000;

export const createTextareaValidator = (
	fieldName = 'textarea',
	maxCharactersErrorMessage = 'Text must not exceed {{maximumCharacters}} characters'
) =>
	createValidator(
		body(fieldName)
			.trim()
			.custom((value) => {
				return value.replace(/[\0\r\n\f]/g, '').length <= TEXTAREA_MAXIMUM_CHARACTERS;
			})
			.withMessage(
				maxCharactersErrorMessage.replace(
					'{{maximumCharacters}}',
					String(TEXTAREA_MAXIMUM_CHARACTERS)
				)
			)
	);
