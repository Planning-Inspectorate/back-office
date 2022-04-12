import express from 'express';
import { param } from 'express-validator';
import asyncHandler from '../middleware/async-handler.js';
import { assignAppeals, bookSiteVisit, getAppeals, issueDecision } from './inspector.controller.js';
import { validateBookSiteVisit, validateIssueDecision, validateStateTransition, validateUserBelongsToAppeal } from './inspector.validators.js';

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

router.post(
	'/:appealId/issue-decision',
	/*
        #swagger.description = 'Book a site visit as an inspector.'
        #swagger.parameters['userId'] = {
            in: 'header',
            type: 'string',
            required: true
        }
        #swagger.parameters['formData'] = {
			in: 'formData',
			description: 'Issue decision payload.',
			schema: { $ref: "#/definitions/IssueDecision" },
            required: true
		}
        #swagger.responses[200] = {
            description: 'The updated appeal.',
            schema: { $ref: '#/definitions/AppealsForInspector' }
        }
	*/
	param('appealId').toInt(),
	// TODO: replace this with an error thrown from `transitionState` else the
	// route has to know about the intended state transition when that's the
	// controller's responsibility
	validateStateTransition('appeal_decided'),
	validateUserBelongsToAppeal,
	validateIssueDecision,
	asyncHandler(issueDecision)
);

export { router as inspectorRoutes };
