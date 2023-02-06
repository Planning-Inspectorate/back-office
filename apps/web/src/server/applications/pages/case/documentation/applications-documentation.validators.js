import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateApplicationsDocumentations = createValidator(
	body('selectedFilesIds')
		.isArray({ min: 1 })
		.withMessage('Select documents to make changes to statuses')
);

export const validateApplicationsDocumentationsDeleteStatus = createValidator(
	body('status')
		.custom((value) => value !== 'ready_to_publish')
		.withMessage('This document is in the publishing queue ready to be published.')
		.custom((value) => value !== 'published')
		.withMessage('This document is published.')
);
