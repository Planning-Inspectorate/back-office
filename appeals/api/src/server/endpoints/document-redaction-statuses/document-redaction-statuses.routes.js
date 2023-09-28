import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/document-redaction-statuses',
	/*
		#swagger.tags = ['Document Redaction Statuses']
		#swagger.path = '/appeals/document-redaction-statuses'
		#swagger.description = 'Gets document redaction statuses'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Document redaction statuses',
			schema: { $ref: '#/definitions/AllDocumentRedactionStatusesResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('documentRedactionStatus'))
);

export { router as documentRedactionStatusesRoutes };
