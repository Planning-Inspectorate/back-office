import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from '#middleware/trim-unexpected-request-parameters.js';
import {
	createApplication,
	getApplicationDetails,
	publishCase,
	startCase,
	queryApplications,
	updateApplication,
	unpublishCase
} from './application.controller.js';
import {
	validateApplicantId,
	validateApplicationId,
	validateCreateUpdateApplication,
	validateGetApplicationQuery
} from './application.validators.js';
import { representaionsRouter } from './representations/representations.routes.js';

const router = createRouter();

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications'
        #swagger.description = 'Creates new application'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Application Details',
            schema: { $ref: '#/definitions/CreateApplication' }
        }
        #swagger.responses[200] = {
            description: 'ID of application',
            schema: { id: 1, applicantId: 2 }
        }
    */
	validateCreateUpdateApplication,
	trimUnexpectedRequestParameters,
	asyncHandler(createApplication)
);

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications'
        #swagger.description = 'Returns the application by its string reference'
        #swagger.parameters['reference'] = {
            in: 'query',
            description: 'Application reference',
            required: false,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Application Details',
            schema: { id: 1, reference: 'AB0110203', status: 'Pre-Application'}
        }
    */
	validateGetApplicationQuery,
	asyncHandler(queryApplications)
);

router.post(
	'/:id/start',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/start'
        #swagger.description = 'Moves application from Draft state to Pre-Application state'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Application ID',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Application Details',
            schema: { id: 1, reference: 'AB0110203', status: 'Pre-Application'}
        }
    */
	validateApplicationId,
	asyncHandler(startCase)
);

router.get(
	'/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}'
        #swagger.description = 'Gets all of the application details'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['query'] = {
            in: 'query',
            description: 'Application details',
			example: '\{ &ldquo;title&rdquo;\:true, &ldquo;description&rdquo;\:true\, &ldquo;reference&rdquo;\:true, &ldquo;status&rdquo;\:true, &ldquo;caseEmail&rdquo;\:true, &ldquo;sector&rdquo;\:true, &ldquo;subSector&rdquo;\:true, &ldquo;applicant&rdquo;\:true, &ldquo;geographicalInformation&rdquo;\:true, &ldquo;keyDates&rdquo;\:true \}',
    	}
      #swagger.responses[200] = {
            description: 'IDs of application',
            schema: { id: 1, reference: "BC010001", title: "Office Use Test Application 1", description: "A description of test case 1 which is a case of subsector type Office Use", status: "Withdrawn", caseEmail: "caseemail@gmail.com", sector: {}, subSector: { name: "office_use", abbreviation: "BC01", displayNameEn: "Office Use", displayNameCy: "Office Use"  }, applicant: {}, geographicalInformation: { mapZoomLevel: { id: 5, name: "district", displayNameEn: "District", displayNameCy: "District" }}, locationDescription: "location description", gridReference: {}, regions: [{}], keyDates: {}, hasUnpublishedChanges: false }
        }
    */
	validateApplicationId,
	validateGetApplicationQuery,
	trimUnexpectedRequestParameters,
	asyncHandler(getApplicationDetails)
);

router.patch(
	'/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}'
        #swagger.description = 'Updates application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Application Details',
            schema: { $ref: '#/definitions/UpdateApplication' }
        }
        #swagger.responses[200] = {
            description: 'ID of application',
            schema: { id: 1, applicantId: 2 }
        }
    */
	validateApplicationId,
	validateApplicantId,
	validateCreateUpdateApplication,
	asyncHandler(updateApplication)
);

router.patch(
	'/:id/publish',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/publish'
        #swagger.description = 'publish application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'response will have the date that the case was published as a timestamp',
            schema: { publishedDate: 1673873105 }
        }
    */
	validateApplicationId,
	asyncHandler(publishCase)
);

router.patch(
	'/:id/unpublish',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/unpublish'
        #swagger.description = 'unpublish application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'response will have the date that the case was unpublished as a timestamp',
            schema: { publishedDate: 1673873105 }
        }
    */
	validateApplicationId,
	asyncHandler(unpublishCase)
);

router.use('/:id/representations', representaionsRouter);

export { router as applicationRoutes };
