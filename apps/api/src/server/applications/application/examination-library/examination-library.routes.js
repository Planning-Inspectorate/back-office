import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import {
	getExaminationLibraryCategoriesHandler,
	createExaminationLibraryCategoriesHandler,
	getExaminationLibraryDocumentsHandler
} from './examination-library.controller.js';

import {
	validateApplicationId,
	validateGetCategories,
	validateCreateCategories,
	validateGetDocuments
} from './examination-library.validators.js';

const router = createRouter({ mergeParams: true });

router.get(
	'/',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{id}/examination-library'
		#swagger.description = 'Gets all examination library categories for an application, optionally filtered by category id or code'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['id'] = {
			in: 'query',
			description: 'Filter by category ID',
			required: false,
			type: 'integer'
		}
		#swagger.parameters['categoryCode'] = {
			in: 'query',
			description: 'Filter by category code',
			required: false,
			type: 'string'
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
			description: 'List of examination library categories for the application',
			schema: [{
				id: 1,
				caseId: 1,
				categoryCode: 'APP',
				categoryName: 'Application form',
				publishedStatus: 'in progress',
				source: 'STATIC'
			}]
		}
		#swagger.responses[404] = {
			description: 'Application not found',
			schema: { errors: { id: "Must be an existing application" } }
		}
	*/
	validateApplicationId,
	validateGetCategories,
	asyncHandler(getExaminationLibraryCategoriesHandler)
);

router.post(
	'/',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{id}/examination-library'
		#swagger.description = 'Creates one or multiple examination library categories for an application'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Category or array of categories to create',
			required: true,
			schema: [{ categoryCode: 'APP', categoryName: 'Application form' }]
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
			description: 'Count of created categories',
			schema: { count: 1 }
		}
		#swagger.responses[400] = {
			description: 'Validation error or duplicate category',
			schema: { errors: { categoryCode: "Category code is required and must be a string" } }
		}
		#swagger.responses[404] = {
			description: 'Application not found',
			schema: { errors: { id: "Must be an existing application" } }
		}
	*/
	validateApplicationId,
	validateCreateCategories,
	asyncHandler(createExaminationLibraryCategoriesHandler)
);

router.get(
	'/documents',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{id}/examination-library/documents'
		#swagger.description = 'Gets documents for an application that have an examination library category assigned'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['categoryCode'] = {
			in: 'query',
			description: 'Filter by category code',
			required: false,
			type: 'string'
		}
		#swagger.parameters['publishedStatus'] = {
			in: 'query',
			description: 'Filter by published status',
			required: false,
			type: 'string'
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
			description: 'List of documents with examination library category details',
			schema: [{
				id: 1,
				guid: 'document-guid',
				documentReference: 'EN010001-000001',
				caseId: 1,
				latestDocumentVersion: {
					examinationLibraryCategoryId: 1,
					publishedStatus: 'published',
					ExaminationLibraryCategory: {
						id: 1,
						categoryCode: 'APP',
						categoryName: 'Application form'
					}
				}
			}]
		}
		#swagger.responses[404] = {
			description: 'Application not found',
			schema: { errors: { id: "Must be an existing application" } }
		}
	*/
	validateApplicationId,
	validateGetDocuments,
	asyncHandler(getExaminationLibraryDocumentsHandler)
);

export { router as examinationLibraryRouter };
