import { validateApplicationId } from '../../application.validators.js';
import { asyncHandler } from '#middleware/async-handler.js';
import { Router as createRouter } from 'express';
import { getPublishableRepresentations } from './publishable.controller.js';

const router = createRouter({ mergeParams: true });

router.get(
	'/',
	/*
            #swagger.tags = ['Applications']
            #swagger.path = '/applications/{id}/representations/publishable'
            #swagger.description = 'Gets publishable representations for an application'
            #swagger.parameters['id'] = {
                                    in: 'path',
                                    description: 'Application ID',
                                    required: true,
                                    type: 'integer'
            }
            #swagger.responses[200] = {
                    description: 'Representations',
                    schema: {
                    		previouslyPublished: false,
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
	asyncHandler(getPublishableRepresentations)
);

export const representationsPublishableRouter = router;
