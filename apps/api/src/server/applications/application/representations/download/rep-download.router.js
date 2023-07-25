import { Router as createRouter } from 'express';
import { getCaseRepDownload } from './rep-download.controller.js';
import { validateApplicationId } from '../../application.validators.js';
import { asyncHandler } from '#middleware/async-handler.js';

const router = createRouter({ mergeParams: true });
router.get(
	'/',
	/*
				#swagger.tags = ['Applications']
				#swagger.path = '/applications/{id}/representations/download'
				#swagger.description = 'Downloads VALID representations on an application'
				#swagger.parameters['id'] = {
							in: 'path',
							description: 'Application ID',
							required: true,
							type: 'integer'
				}
				#swagger.responses[200] = {
				#swagger.produces = ['text/csv']
					 description: 'Representations'
				}

	*/
	validateApplicationId,
	asyncHandler(getCaseRepDownload)
);

export const getRepDownloadRouter = router;
