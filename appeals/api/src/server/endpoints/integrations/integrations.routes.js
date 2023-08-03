import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import * as controller from './integrations.controller.js';

const router = createRouter();

router.post(
	'/case-submission',
	/*
		#swagger.tags = ['Integration']
		#swagger.path = '/appeals/case-submission'
		#swagger.description = Request the creation of a new case
		#swagger.requestBody = {
			in: 'body',
			description: 'Case data',
			schema: { $ref: '#/definitions/CaseData' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Appeal successfully created',
			schema: { $ref: '#/definitions/Appeal' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	//TODO: validators
	asyncHandler(controller.postAppealSubmission)
);

router.post(
	'/document-submission',
	/*
		#swagger.tags = ['Integration']
		#swagger.path = '/appeals/document-submission'
		#swagger.description = Imports a new document
		#swagger.requestBody = {
			in: 'body',
			description: 'Document',
			schema: { $ref: '#/definitions/DocumentDetails' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Document successfully created',
			schema: { $ref: '#/definitions/DocumentDetails' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	//TODO: validators
	asyncHandler(controller.postDocumentSubmission)
);

export { router as integrationsRoutes };
