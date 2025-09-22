import { validateApplicationId } from '../../application.validators.js';
import { asyncHandler } from '@pins/express';
import { Router as createRouter } from 'express';
import {
	getUnpublishableRepresentations,
	postUnpublishRepresentations
} from './unpublish.controller.js';
import { validateUnpublishRepresentations } from './unpublish.validators.js';

const router = createRouter({ mergeParams: true });

router.get(
	'/',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{id}/representations/unpublish'
		#swagger.description = 'Gets unpublishable representations for an application'
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			description: 'Service name header',
			required: false,
			type: 'string',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			description: 'API key header',
			required: false,
			type: 'string',
			default: '123'
		}
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.responses[200] = {
				description: 'Unpublishable Representations',
				schema: {
					previouslyUnpublished: false,
					itemCount: 100,
					items: [
						{
								"$ref": '#/definitions/RepresentationSummary'
						}
					]
			}
		}
	*/
	validateApplicationId,
	asyncHandler(getUnpublishableRepresentations)
);

router.patch(
	'/',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{id}/representations/unpublish'
		#swagger.description = 'Unpublishes representations on an application that are currently PUBLISHED'
		#swagger.operationId = 'unpublishRepresentations'
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			description: 'Service name header',
			required: false,
			type: 'string',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			description: 'API key header',
			required: false,
			type: 'string',
			default: '123'
		}
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Representation IDs to unpublish, and user performing action',
			required: true,
			schema: {
					representationIds: [123, 124, 125],
					actionBy: "Joe Bloggs"
			}
		}
		#swagger.responses[200] = {
			description: 'Unpublished Representations',
			schema: {
					unpublishedRepIds: [123, 134, 125]
			}
		}
		#swagger.responses[400] = {
			description: 'Error: Bad Request',
			schema: { $ref: '#/definitions/GeneralError' }
		}
	*/
	validateApplicationId,
	validateUnpublishRepresentations,
	asyncHandler(postUnpublishRepresentations)
);

export const representationsUnpublishRouter = router;
