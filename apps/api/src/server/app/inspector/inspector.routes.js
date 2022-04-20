import express from 'express';
import { param } from 'express-validator';
import asyncHandler from '../middleware/async-handler.js';
import { assignAppeals, bookSiteVisit, getAppeals, issueDecision, getAppealDetails } from './inspector.controller.js';
import {
	validateAssignAppealsToInspector,
	validateBookSiteVisit,
	validateIssueDecision,
	validateUserBelongsToAppeal,
	validateUserId
} from './inspector.validators.js';

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

router.get(
	'/:appealId',
	/*
        #swagger.description = 'Gets details of appeal for inspector'
        #swagger.parameters['userId'] = {
            in: 'header',
            type: 'integer',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Appeal Details',
            schema: { $ref: '#/definitions/AppealDetailsForInspector' }
        }
    */
	param('appealId').toInt(),
	validateUserBelongsToAppeal,
	asyncHandler(getAppealDetails)
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
	validateUserBelongsToAppeal,
	validateIssueDecision,
	asyncHandler(issueDecision)
);

router.get(
	'/more-appeals',
	/*
        #swagger.description = 'Gets appeals yet to be assigned to inspector'
        #swagger.responses[200] = {
            description: 'Appeals that are yet to be assigned to inspector',
            schema: { $ref: '#/definitions/AppealsForInspector' }
        }
    */
	asyncHandler(getMoreAppeals)
);

export { router as inspectorRoutes };
