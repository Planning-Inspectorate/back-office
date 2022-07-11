import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsCreateApplicantTypes = createValidator(
	body('selectedApplicantInfoTypes')
		.isArray({ min: 1 })
		.withMessage('Choose the type of applicant information you can give')
);
