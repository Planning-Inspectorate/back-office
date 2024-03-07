import { createValidator } from '@pins/express';
import { body } from 'express-validator';

const TEXTAREA_MAXIMUM_CHARACTERS = 1000;

export const createTextareaValidator = (
	fieldName = 'textarea',
	emptyErrorMessage = 'Enter text',
	maximumCharactersAllowed = TEXTAREA_MAXIMUM_CHARACTERS,
	maximumCharactersErrorMessage = `Text must be ${TEXTAREA_MAXIMUM_CHARACTERS} characters or less`
) =>
	createValidator(
		body(fieldName)
			.trim()
			.isLength({ min: 1 })
			.withMessage(emptyErrorMessage)
			.bail()
			.isLength({ max: maximumCharactersAllowed })
			.withMessage(maximumCharactersErrorMessage)
	);
