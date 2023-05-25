import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import * as examinationTimetableTypesRepository from '../../repositories/examination-timetable-types.repository.js';
import { validateExistingApplication } from '../application/application.validators.js';
import { validationErrorHandler } from '../../middleware/error-handler.js';

/**
 *
 * @param {number} value
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateExistingExaminationTimetable = async (value) => {
	const subSector = await examinationTimetableTypesRepository.getById(value);

	if (subSector === null) {
		throw new Error('Unknown examination type');
	}
};

export const validateCreateExaminationTimetableItem = composeMiddleware(
	body('caseId').toInt().custom(validateExistingApplication).withMessage('Must be valid case id'),
	body('examinationTypeId')
		.toInt()
		.custom(validateExistingExaminationTimetable)
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
