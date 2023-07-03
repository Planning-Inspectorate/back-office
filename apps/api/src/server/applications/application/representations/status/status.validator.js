import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../../../middleware/error-handler.js';
import { representationsStatusesList } from '../representation.validators.js';

const invalidReasons = ['Duplicate', 'Merged', 'Not relevant', 'Resubmitted', 'Test'];
const referredTo = ['Case Team', 'Inspector', 'Central Admin Team', 'Interested Party'];
export const representationPatchStatusValidator = composeMiddleware(
	body('status')
		.isString()
		.isIn(representationsStatusesList)
		.withMessage(`Must be a valid status: ${representationsStatusesList}`)
		.custom((value, { req: { body } }) => {
			if (value === 'INVALID' && !body.invalidReason)
				throw Error('INVALID status requires invalidReason');

			if (value === 'REFERRED' && !body.referredTo)
				throw Error('REFERRED status requires referredTo');

			return true;
		}),
	body('notes').optional(),
	body('updatedBy').exists().withMessage('is a required field'),
	body('invalidReason')
		.optional()
		.isString()
		.isIn(invalidReasons)
		.withMessage(`Must be a valid: ${invalidReasons}`),
	body('referredTo')
		.optional()
		.isString()
		.isIn(referredTo)
		.withMessage(`Must be a valid: ${referredTo}`),

	validationErrorHandler
);
