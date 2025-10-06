import { Router as createRouter } from 'express';
import { getPublishedCaseRepDownload, getValidCaseRepDownload } from './rep-download.controller.js';
import { validateApplicationId } from '../../application.validators.js';
import { asyncHandler } from '@pins/express';

const router = createRouter({ mergeParams: true });
router.get(
	'/published',
	/*
				#swagger.tags = ['Applications']
				#swagger.path = '/applications/{id}/representations/download/published'
				#swagger.description = 'Downloads VALID representations that are PUBLISHED on an application'
				#swagger.parameters['id'] = {
							in: 'path',
							description: 'Application ID',
							required: true,
							type: 'integer'
				}
				#swagger.produces = ['text/csv']
				#swagger.responses[200] = {
					description: 'Representations CSV'
				}

	*/
	validateApplicationId,
	asyncHandler(getPublishedCaseRepDownload)
);
router.get(
	'/valid',
	/*
				#swagger.tags = ['Applications']
				#swagger.path = '/applications/{id}/representations/download/valid'
				#swagger.description = 'Downloads VALID representations on an application'
				#swagger.parameters['id'] = {
							in: 'path',
							description: 'Application ID',
							required: true,
							type: 'integer'
				}
				#swagger.produces = ['text/csv']
				#swagger.responses[200] = {
					description: 'Representations CSV'
				}

	*/
	validateApplicationId,
	asyncHandler(getValidCaseRepDownload)
);

export const getRepDownloadRouter = router;
