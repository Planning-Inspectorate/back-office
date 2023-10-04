import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import {
	validateAppellantCase,
	validateLpaQuestionnaire,
	validateDocument
} from './integrations.middleware.js';
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
			schema: { $ref: '#/definitions/AppellantCaseData' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Appeal successfully created',
			schema: { $ref: '#/definitions/Appeal' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	validateAppellantCase,
	asyncHandler(controller.postAppealSubmission)
);

router.post(
	'/lpaq-submission',
	/*
		#swagger.tags = ['Integration']
		#swagger.path = '/appeals/lpaq-submission'
		#swagger.description = Request adding LPA response to an existing case
		#swagger.requestBody = {
			in: 'body',
			description: 'Questionnaire data',
			schema: { $ref: '#/definitions/QuestionnaireData' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Appeal successfully updated',
			schema: { $ref: '#/definitions/Appeal' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	validateLpaQuestionnaire,
	asyncHandler(controller.postLpaqSubmission)
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
			schema: { $ref: '#/definitions/DocumentMetaImport' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Document successfully created',
			schema: { $ref: '#/definitions/DocumentDetails' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	validateDocument,
	asyncHandler(controller.postDocumentSubmission)
);

export { router as integrationsRoutes };
