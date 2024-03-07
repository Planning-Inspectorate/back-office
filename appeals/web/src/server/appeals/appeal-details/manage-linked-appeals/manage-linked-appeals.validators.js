import logger from '#lib/logger.js';
import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { getLinkableAppealByReference } from './manage-linked-appeals.service.js';

export const validateAddLinkedAppealReference = createValidator(
	body('appeal-reference')
		.trim()
		.notEmpty()
		.withMessage('Enter an appeal reference')
		.bail()
		.custom(async (reference, { req }) => {
			try {
				const linkableAppealSummary = await getLinkableAppealByReference(
					req.apiClient,
					reference
				).catch((error) => {
					if (error.response.statusCode === 404) {
						return Promise.reject();
					}
				});

				req.session.linkableAppeal = {
					linkableAppealSummary
				};

				return Promise.resolve();
			} catch (error) {
				logger.error(error);
				throw new Error('error when attempting to validate linkable appeal reference');
			}
		})
		.withMessage('Enter a valid appeal reference')
);

export const validateAddLinkedAppealCheckAndConfirm = createValidator(
	body('confirmation')
		.trim()
		.notEmpty()
		.withMessage('Choose an option')
		.bail()
		.isIn(['lead', 'child', 'cancel'])
		.withMessage('Choose an option')
);

export const validateUnlinkAppeal = createValidator(
	body('unlinkAppeal').trim().notEmpty().withMessage('Please choose an option')
);
