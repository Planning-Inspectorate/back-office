import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { param } from 'express-validator';
import * as examinationTimetableTypesRepository from '../../repositories/examination-timetable-types.repository.js';
import * as examinationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';
import { validateExistingApplication } from '../application/application.validators.js';
import { validationErrorHandler } from '../../middleware/error-handler.js';

/**
 *
 * @param {number} value
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateExistingExaminationTimetableType = async (value) => {
	const examinationTimetableType = await examinationTimetableTypesRepository.getById(value);

	if (examinationTimetableType === null) {
		throw new Error('Unknown examination type');
	}
};

/**
 *
 * @param {number} value
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateExistingExaminationTimetableItem = async (value) => {
	const examinationTimetableItem = await examinationTimetableItemsRepository.getById(value);
	if (examinationTimetableItem === null) {
		throw new Error('Unknown examination item id');
	}
};

export const validateExistingExaminationTimetableItemId = composeMiddleware(
	param('id')
		.isInt()
		.toInt()
		.withMessage('Examination timetable item id must be a valid numerical value')
		.custom(validateExistingExaminationTimetableItem)
		.withMessage('Must be an existing examination timetable item'),
	validationErrorHandler
);

export const validateCreateExaminationTimetableItem = composeMiddleware(
	body('caseId').toInt().custom(validateExistingApplication).withMessage('Must be valid case id'),
	body('examinationTypeId')
		.toInt()
		.custom(validateExistingExaminationTimetableType)
		.withMessage('Must be valid examination type'),
	body('name').notEmpty().withMessage('Name not be empty'),
	body('description').optional({ nullable: true }),
	body('date').toDate(),
	body('startDate').toDate().optional({ nullable: true }),
	body('startTime').optional({ nullable: true }),
	body('endDate').toDate().optional({ nullable: true }),
	body('endTime').optional({ nullable: true }),
	validationErrorHandler
);

// validator for updating an Examination Timetable Item.  Can update single properties or multiple
export const validateUpdateExaminationTimetableItem = composeMiddleware(
	body('caseId')
		.toInt()
		.custom(validateExistingApplication)
		.withMessage('Must be valid case id')
		.optional({ nullable: true }),
	body('examinationTypeId')
		.toInt()
		.custom(validateExistingExaminationTimetableType)
		.withMessage('Must be valid examination type')
		.optional({ nullable: true }),
	body('name').optional({ nullable: true }),
	body('description').optional({ nullable: true }),
	body('date').toDate().optional({ nullable: true }),
	body('startDate').toDate().optional({ nullable: true }),
	body('startTime').optional({ nullable: true }),
	body('endTime').optional({ nullable: true }),
	validationErrorHandler
);
