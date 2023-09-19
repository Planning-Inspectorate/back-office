import { composeMiddleware } from '@pins/express';
import { body, param } from 'express-validator';
import * as s51AdviceRepository from '../../repositories/s51-advice.repository.js';
import * as s51AdviceDocumentRepository from '../../repositories/s51-advice-document.repository.js';
import { validateExistingApplication } from '../application/application.validators.js';
import { validationErrorHandler } from '../../middleware/error-handler.js';

/**
 *
 * @param {number} id
 * @throws {Error}
 * @returns {Promise<void>}
 * */
export const validateExistingS51Advice = async (id) => {
	const s51 = await s51AdviceRepository.get(id);
	if (!s51) {
		throw new Error(`unknown S51 advice with id ${id}`);
	}
};

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

export const validateS51AdviceId = composeMiddleware(
	param('adviceId')
		.toInt()
		.isInt()
		.withMessage('Advice id must be a valid numerical value')
		.custom(validateExistingS51Advice)
		.withMessage('Must be an existing S51 advice item'),
	validationErrorHandler
);

/**
 * Verifies if the given array of S51 Advice IDs have the correct required fields, so that they are ready to publish
 *
 * TODO: Let's make this return an error instead of throwing one
 *
 * @param {number[]} s51AdviceIds
 * @throws {Error}
 * @returns {Promise<{id: number}[]>}
 */
export const verifyAllS51AdviceHasRequiredPropertiesForPublishing = async (s51AdviceIds) => {
	const publishableS51Advice = await s51AdviceRepository.getPublishableS51Advice(s51AdviceIds);

	if (s51AdviceIds.length !== publishableS51Advice.length) {
		const publishableIds = new Set(publishableS51Advice.map((pAdvice) => pAdvice.id));
		// TODO: Return instead?
		throw new Error(
			JSON.stringify(
				s51AdviceIds
					.filter((adviceId) => !publishableIds.has(adviceId))
					.map((id) => ({
						id
					}))
			)
		);
	}

	return publishableS51Advice.map(({ id }) => ({
		id: id
	}));
};

/**
 * Verifies if the attachments for the given S51 Advice have been virus scanned and found clean
 *
 * @param {number} adviceId
 * @throws {Error}
 */
export const verifyAllS51DocumentsAreVirusChecked = async (adviceId) => {
	const adviceRecord = await s51AdviceRepository.get(adviceId);
	if (!adviceRecord) {
		throw new Error(`no S51 advice record found with ID ${adviceId}`);
	}

	const attachments = await s51AdviceDocumentRepository.getForAdvice(Number(adviceId));
	if (!attachments || attachments?.length === 0) {
		return;
	}

	attachments.forEach((attachment) => {
		// @ts-ignore
		const { Document } = attachment;
		const { latestDocumentVersion } = Document;
		if (!latestDocumentVersion) {
			return;
		}

		if (
			['awaiting_upload', 'awaiting_virus_check', 'failed_virus_check'].includes(
				latestDocumentVersion.publishedStatus
			)
		) {
			throw new Error('Documents were not successfully virus scanned');
		}
	});
};

/**
 *
 * @param {number[]} adviceIds
 * @returns {Promise<boolean>}
 */
export const hasPublishedAdvice = async (adviceIds) => {
	const publishedAdvices = await s51AdviceRepository.getPublishedAdvicesByIds(adviceIds);
	if (publishedAdvices && publishedAdvices?.length > 0) {
		return true;
	}
	return false;
};

/**
 *
 * @param {number[]} adviceIds
 * @returns {Promise<boolean>}
 */
export const hasPublishedDocument = async (adviceIds) => {
	const publishedAdvices = await s51AdviceDocumentRepository.getPublishedDocumentsByAdviceIds(
		adviceIds
	);
	if (publishedAdvices && publishedAdvices?.length > 0) {
		return true;
	}
	return false;
};
