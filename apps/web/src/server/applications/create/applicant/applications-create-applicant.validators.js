import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsCreateApplicantPostCode = createValidator(
	body('postcode')
		.trim()
		.matches(
			/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z]\d{1,2})|(([A-Za-z][A-HJ-Ya-hj-y]\d{1,2})|(([A-Za-z]\d[A-Za-z])|([A-Za-z][A-HJ-Ya-hj-y]\d[A-Za-z]?))))\s?\d[A-Za-z]{2})$/
		)
		.withMessage('Enter a valid postcode'),
	body('apiReference').trim().not().equals('-1')
.withMessage('Choose an address from the list')
);
