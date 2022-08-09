import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import {
	createApplication,
	getApplicationDetails,
	startCase,
	updateApplication
} from './application.controller.js';
import {
	validateApplicantId,
	validateApplicationId,
	validateCreateUpdateApplication,
	validateExistingApplication
} from './application.validators.js';

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
            schema: { id: 1, applicantIds: [2] }
        }
    */
	validateCreateUpdateApplication,
	asyncHandler(createApplication)
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
            schema: { id: 1, applicantIds: [2] }
        }
    */
	validateApplicationId,
	validateApplicantId,
	validateCreateUpdateApplication,
	asyncHandler(updateApplication)
);

router.get(
	'/:id?',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}'
        #swagger.description = 'Gets all of the application details'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['query'] = {
            in: 'query',
            description: 'Application details',
            schema: { }
    	}
      #swagger.responses[200] = {
            description: 'IDs of application',
            schema: { id: 1, reference: "BC010001", title: "Office Use Test Application 1", description: "A description of test case 1 which is a case of subsector type Office Use", status: "Withdrawn", caseEmail: "caseemail@gmail.com", sector: {}, subSector: { name: "office_use", abbreviation: "BC01", displayNameEn: "Office Use", displayNameCy: "Office Use"  }, applicants: [], geographicalInformation: { mapZoomLevel: { id: 5, name: "district", displayNameEn: "District", displayNameCy: "District" }}, locationDescription: "location description", gridReference: {}, regions: [{}], keyDates: {} }
        }
    */
	validateApplicationId,
	validateExistingApplication,
	asyncHandler(getApplicationDetails)
);

export { router as applicationRoutes };
