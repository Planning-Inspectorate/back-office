import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import * as s51AdviceRepository from '../../repositories/s51-advice.repository.js';
import { validateExistingApplication } from '../application/application.validators.js';
import { validationErrorHandler } from '../../middleware/error-handler.js';

export const validateCreateS51Advice = composeMiddleware(
	body('caseId').toInt().custom(validateExistingApplication).withMessage('Must be valid case id'),
	body('title').notEmpty().withMessage('Title must not be empty'),
	body('firstName')
		.if(body('enquirer').isEmpty())
		.notEmpty()
		.withMessage('First name must not be empty'),
	body('lastName')
		.if(body('enquirer').isEmpty())
		.notEmpty()
		.withMessage('Last name must not be empty'),
	body('enquirer')
		.if(body('firstName').isEmpty() && body('lastName').isEmpty())
		.notEmpty()
		.withMessage('Enquirer must not be empty'),
	body('enquiryMethod').notEmpty().withMessage('Enquirer method must not be empty'),
	body('enquiryDate').toDate(),
	body('enquiryDetails').notEmpty().withMessage('Enquiry details must not be empty'),
	body('adviser').notEmpty().withMessage('Adviser must not be empty'),
	body('adviceDate').toDate(),
	body('adviceDetails').notEmpty().withMessage('Advice details must not be empty'),
	validationErrorHandler
);

export const validatePaginationCriteria = composeMiddleware(
	body('pageNumber')
		.isInt({ min: 1 })
		.toInt()
		.withMessage('Page Number is not valid')
		.optional({ nullable: true }),
	body('pageSize')
		.isInt({ min: 1 })
		.toInt()
		.withMessage('Page Size is not valid')
		.optional({ nullable: true }),
	validationErrorHandler
);

export const validateS51AdviceToUpdateProvided = composeMiddleware(
	body('[]').notEmpty().withMessage('Must provide S51 Advice to update'),
	validationErrorHandler
);

/**
 * Validate that an array of S51 Advice ids exist
 *
 * @param {{id: number }[]} s51Adviceids
 */
const validateAllS51AdviceExists = async (s51Adviceids) => {
	if (s51Adviceids) {
		for (const adviceId of s51Adviceids) {
			try {
				const adviceRecord = await s51AdviceRepository.get(adviceId.id);

				if (adviceRecord === null || typeof adviceRecord === 'undefined') {
					throw new Error(`Unknown S51 Advice id ${adviceId.id}`);
				}
			} catch {
				throw new Error(`Unknown S51 Advice id ${adviceId.id}`);
			}
		}
	} else {
		throw new Error('No S51 Advice ids specified');
	}
};

export const validateS51AdviceIds = composeMiddleware(
	body('[].items').custom(validateAllS51AdviceExists),
	validationErrorHandler
);
