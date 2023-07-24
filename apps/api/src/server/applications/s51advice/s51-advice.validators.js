import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validateExistingApplication } from '../application/application.validators.js';
import { validationErrorHandler } from '../../middleware/error-handler.js';

export const validateCreateS51Advice = composeMiddleware(
	body('caseId').toInt().custom(validateExistingApplication).withMessage('Must be valid case id'),
	body('title').notEmpty().withMessage('Title must not be empty'),
	body('enquirer').notEmpty().withMessage('Enquirer must not be empty'),
	body('enquiryMethod').notEmpty().withMessage('Enquirer method must not be empty'),
	body('enquiryDate').toDate(),
	body('enquiryDetails').notEmpty().withMessage('Enquiry details must not be empty'),
	body('adviser').notEmpty().withMessage('Enquiry details must not be empty'),
	body('adviceDate').toDate(),
	body('adviceDetails').notEmpty().withMessage('Enquirer method must not be empty'),
	validationErrorHandler
);
