import { validateApplicationId } from '../../application.validators.js';
import { asyncHandler } from '@pins/express';
import { Router as createRouter } from 'express';
import { publishRepresentations } from './publish.controller.js';
import { validatePublishRepresentations } from './publish.validators.js';

const router = createRouter({ mergeParams: true });

router.patch(
	'/',
	/*
			#swagger.tags = ['Applications']
			#swagger.path = '/applications/{id}/representations/publish'
			#swagger.description = 'Publishes representations on an application that are VALID or PUBLISHED with unpublishedUpdates'
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
					description: 'Representation IDs to publish, and user performing action',
					required: true,
					schema: {
							representationIds: [123, 124, 125],
							actionBy: "Joe Bloggs"
					}
			}
			#swagger.responses[200] = {
					description: 'Representation',
					schema: {
							publishedRepIds: [123, 134, 125]
					}
			}
			#swagger.responses[400] = {
				description: 'Error: Bad Request',
				schema: { $ref: '#/definitions/GeneralError' }
			}
	 */
	validateApplicationId,
	validatePublishRepresentations,
	asyncHandler(publishRepresentations)
);

export const representationsPublishRouter = router;
