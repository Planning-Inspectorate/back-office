import express from 'express';
import { param } from 'express-validator';
import asyncHandler from '../middleware/async-handler.js';
import { getAppeals, assignAppeals, bookSiteVisit } from './inspector.controller.js';
import { validateBookSiteVisit, validateUserBelongsToAppeal, validateUserId, validateAssignAppealsToInspector } from './inspector.validators.js';

const router = express.Router();

router.get(
	'/',
	/*
        #swagger.description = 'Gets appeals assigned to inspector'
        #swagger.parameters['userid'] = {
            in: 'header',
            type: 'integer',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Appeals that are assigned to inspector',
            schema: { $ref: '#/definitions/AppealsForInspector' }
        }
    */
	asyncHandler(getAppeals)
);

router.post(
	'/assign',
	/*
        #swagger.description = 'Assigns appeals to inspector'
        #swagger.parameters['userId'] = {
            in: 'header',
            type: 'integer',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Appeals that were assigned to inspector and those that failed to be assigned',
            schema: { $ref: '#/definitions/AppealsAssignedToInspector' }
        }
    */
    validateUserId,
    validateAssignAppealsToInspector,
	asyncHandler(assignAppeals)
);

router.post(
	'/:appealId/book',
	/*
        #swagger.description = 'Book a site visit as an inspector.'
        #swagger.parameters['userId'] = {
            in: 'header',
            type: 'string',
            required: true
        }
        #swagger.parameters['appealId'] = {
            in: 'url',
            description: 'Unique identifier for the appeal.',
            type: 'string',
            required: true
        }
        #swagger.parameters['body'] = {
			in: 'body',
			description: 'Book site visit payload.',
			schema: { $ref: "#/definitions/BookSiteVisit" },
            required: true
		}
        #swagger.responses[200] = {
            description: 'The updated appeal.',
            schema: { $ref: '#/definitions/AppealsForInspector' }
        }
	*/
	param('appealId').toInt(),
	validateUserBelongsToAppeal,
	validateBookSiteVisit,
	asyncHandler(bookSiteVisit)
);

export { router as inspectorRoutes };
