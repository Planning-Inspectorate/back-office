import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { param } from 'express-validator';
import * as examinationTimetableTypesRepository from '#repositories/examination-timetable-types.repository.js';
import * as examinationTimetableItemsRepository from '#repositories/examination-timetable-items.repository.js';
import * as examinationTimetableRepository from '#repositories/examination-timetable.repository.js';
import {
	validateExistingApplication,
	verifyNotTraining
} from '../application/application.validators.js';
import { customErrorValidationHandler, validationErrorHandler } from '#middleware/error-handler.js';
import logger from '#utils/logger.js';
import isCaseWelsh from '#utils/is-case-welsh.js';

/**
 * Validate that an exam timetable item type exists
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
 * Validate that an exam timetable item record exists
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

/**
 * Validate that an exam timetable item name is not 'Other'
 *
 * @param {string} value
 * @throws {Error}
 * @returns {Promise<void>}
 */
const validateExaminationTimetableItemNameNotOther = async (value) => {
	if (value.toLowerCase() === 'other') {
		throw new Error('Cannot use exam item name Other');
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
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Name not be empty')
		.custom(validateExaminationTimetableItemNameNotOther)
		.withMessage('Name cannot be Other, please enter another name'),
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
	body('name')
		.trim()
		.custom(validateExaminationTimetableItemNameNotOther)
		.withMessage('Name cannot be Other, please enter another name')
		.optional({ nullable: true }),
	body('description').optional({ nullable: true }),
	body('date').toDate().optional({ nullable: true }),
	body('startDate').toDate().optional({ nullable: true }),
	body('startTime').optional({ nullable: true }),
	body('endTime').optional({ nullable: true }),
	validationErrorHandler
);

/**
 * @param {number} id
 * @throws {Error}
 * */
export const verifyNotTrainingExamTimetable = async (id) => {
	const timetable = await examinationTimetableRepository.getById(id);
	if (!timetable) {
		throw new Error(`Could not find examination timetable item with ID ${id}`);
	}

	try {
		await verifyNotTraining(timetable.caseId);
	} catch (/** @type {*} */ err) {
		logger.info(`Could not verify examination timetable with ID ${id}`, err.message);
	}
};

/**
 * Generate errors for examination timetable items
 * @param {import('@pins/applications.api').Schema.ExaminationTimetableItem[]} timetableItems
 */

const generateExamTimetablePublishingErrors = (timetableItems) => {
	/** @type {Record<string, {msg: string}>}*/
	const errors = {};
	timetableItems.forEach((item) => {
		if (!item.nameWelsh || item.nameWelsh.trim() === '') {
			errors[`nameWelsh-${item.id}`] = {
				msg: `Enter examination timetable item name in welsh - ${item.name}`
			};
		}
	});
	return errors;
};

/**
 * Validate that all welsh case examination timetable items have a welsh name
 * @param {number} value
 * @throws {Error}
 * @returns {Promise<void>}
 *
 */

export const validateExamTimetableWelshName = async (value) => {
	const caseIsWelsh = await isCaseWelsh(value);

	if (!caseIsWelsh) return;

	const timetableData = await examinationTimetableRepository.getByCaseId(value);
	if (!timetableData) throw new Error(`Could not find examination timetable with ID ${value}`);

	const examinationTimetableItems = await examinationTimetableRepository.getWithItems(
		timetableData.id
	);
	if (!examinationTimetableItems)
		throw new Error(`Could not find examination timetable items with ID ${value}`);

	const welshNamesNotValid = examinationTimetableItems.ExaminationTimetableItem.some(
		(item) => !item.nameWelsh || item.nameWelsh.trim() === ''
	);

	if (welshNamesNotValid) {
		const errors = generateExamTimetablePublishingErrors(
			examinationTimetableItems.ExaminationTimetableItem
		);
		if (Object.keys(errors).length > 0) {
			throw new Error(JSON.stringify(errors));
		}
	}
};

export const validatePublishExamTimetable = composeMiddleware(
	param('id').custom(validateExamTimetableWelshName),
	customErrorValidationHandler
);
