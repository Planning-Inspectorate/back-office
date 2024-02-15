import logger from '#lib/logger.js';
import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { getLinkableAppealByReference } from './linked-appeals.service.js';

export const validateAddLinkedAppeal = createValidator(
	body('appeal-reference')
	//.trim()
	// .notEmpty()
	// .withMessage('Enter an appeal reference')
	// .bail()
	.custom(async (reference, { req }) => {
		try {
			const linkableAppealSummary = await getLinkableAppealByReference(req.apiClient, reference);

			// TODO: only get to here if the reference was found

			console.log('linkableAppealSummary:');
			console.log(linkableAppealSummary);

			return Promise.resolve();
		}
		catch (error) {
			// TODO: if reference is not found, this block is triggered as a 404 is returned (quite inconvenient, I asked for this to return a 200 with data in the body indicating whether the appeal was found or not)
			logger.error(error);
			return Promise.reject();
		}
	})
	.withMessage('Enter a valid appeal reference')
);

export const validateUnlinkAppeal = createValidator(
	body('unlinkAppeal').trim().notEmpty().withMessage('Please choose an option')
);
