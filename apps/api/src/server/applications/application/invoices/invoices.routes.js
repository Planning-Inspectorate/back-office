import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { validateApplicationId } from '../application.validators.js';
import { validateCreateOrUpdateInvoice } from './invoices.validators.js';
import {
	getAllCaseInvoicesController,
	getCaseInvoiceController,
	createOrUpdateInvoiceController,
	deleteInvoiceController
} from './invoices.controller.js';

const router = createRouter({ mergeParams: true });

router.get(
	'/',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{caseId}/invoices'
		#swagger.description = 'Get all invoices for a case'
		#swagger.parameters['caseId'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['x-service-name'] = {
				in: 'header',
				type: 'string',
				description: 'Service name header',
				default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
		#swagger.responses[200] = {
			description: 'List of invoices',
			schema: {
		 				type: 'array',
		 				items: { $ref: '#/definitions/Invoice' }
			}
		}
	*/
	validateApplicationId,
	asyncHandler(getAllCaseInvoicesController)
);

router.get(
	'/:invoiceId',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{caseId}/invoices/{invoiceId}'
		#swagger.description = 'Get a single invoice by invoice Id'
		#swagger.parameters['caseId'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['invoiceId'] = {
			in: 'path',
			description: 'Invoice ID',
			required: true,
			type: 'integer'
		}
		#swagger.responses[200] = {
			description: 'Invoice',
			schema: {
				$ref: '#/definitions/Invoice'
			}
		}
	*/
	validateApplicationId,
	asyncHandler(getCaseInvoiceController)
);

router.post(
	'/',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{caseId}/invoices'
		#swagger.description = 'Create an invoice'
		#swagger.parameters['caseId'] = {
			in: 'path',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			required: true,
			schema: { $ref: '#/definitions/InvoiceCreateOrUpdateRequest' }
		}
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header', type:
			'string',
			default: '123'
		}
		#swagger.responses[201] = {
			description: 'Created',
			schema: { $ref: '#/definitions/Invoice' }
		}
	*/
	validateApplicationId,
	validateCreateOrUpdateInvoice,
	asyncHandler(createOrUpdateInvoiceController)
);

router.patch(
	'/:invoiceId',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{caseId}/invoices/{invoiceId}'
		#swagger.description = 'Update an invoice'
		#swagger.parameters['caseId'] = {
			in: 'path',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['invoiceId'] = {
			in: 'path',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			required: true,
			schema: { $ref: '#/definitions/InvoiceCreateOrUpdateRequest' }
		 }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			default: '123'
		}
		#swagger.responses[200] = {
			description: 'Updated',
			schema: { $ref: '#/definitions/Invoice' }
		}
	*/
	validateApplicationId,
	validateCreateOrUpdateInvoice,
	asyncHandler(createOrUpdateInvoiceController)
);

router.delete(
	'/:invoiceId',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{caseId}/invoices/{invoiceId}'
		#swagger.description = 'Delete an invoice'
		#swagger.parameters['caseId'] = {
			in: 'path',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['invoiceId'] = {
			in: 'path',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			default: 'swagger'
		 }
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			default: '123'
		}
		#swagger.responses[204] = {
			description: 'Deleted'
		}
	*/
	validateApplicationId,
	asyncHandler(deleteInvoiceController)
);

export const invoicesRouter = router;
