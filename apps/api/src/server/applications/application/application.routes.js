import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from '../../middleware/trim-unexpected-request-parameters.js';
import {
	createApplication,
	createApplicationRepresentation,
	getApplicationDetails,
	getApplicationRepresentation,
	getApplicationRepresentations,
	publishCase,
	startCase,
	updateApplication
} from './application.controller.js';
import {
	validateApplicantId,
	validateApplicationId,
	validateCreateRepresentation,
	validateCreateUpdateApplication,
	validateGetApplicationQuery,
	validateGetRepresentationsQuery,
	validateRepresentationId
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
	trimUnexpectedRequestParameters,
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
			example: '\{ &ldquo;title&rdquo;\:true, &ldquo;description&rdquo;\:true\, &ldquo;reference&rdquo;\:true, &ldquo;status&rdquo;\:true, &ldquo;caseEmail&rdquo;\:true, &ldquo;sector&rdquo;\:true, &ldquo;subSector&rdquo;\:true, &ldquo;applicants&rdquo;\:true, &ldquo;geographicalInformation&rdquo;\:true, &ldquo;keyDates&rdquo;\:true \}',
    	}
      #swagger.responses[200] = {
            description: 'IDs of application',
            schema: { id: 1, reference: "BC010001", title: "Office Use Test Application 1", description: "A description of test case 1 which is a case of subsector type Office Use", status: "Withdrawn", caseEmail: "caseemail@gmail.com", sector: {}, subSector: { name: "office_use", abbreviation: "BC01", displayNameEn: "Office Use", displayNameCy: "Office Use"  }, applicants: [], geographicalInformation: { mapZoomLevel: { id: 5, name: "district", displayNameEn: "District", displayNameCy: "District" }}, locationDescription: "location description", gridReference: {}, regions: [{}], keyDates: {} }
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
            schema: { id: 1, applicantIds: [2] }
        }
    */
	validateApplicationId,
	validateApplicantId,
	validateCreateUpdateApplication,
	trimUnexpectedRequestParameters,
	asyncHandler(updateApplication)
);

router.get(
	'/:id/representations',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations'
        #swagger.description = 'Gets list of representations on an application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['page'] = {
            in: 'query',
			description: 'Page to show',
			required: false,
			type: 'integer',
			example: 1,
			minimum: 1,
		}
		#swagger.parameters['pageSize'] = {
            in: 'query',
			description: 'Page size',
			required: false,
			type: 'integer',
			example: 25,
			minimum: 1,
			maximum: 100
		}
		#swagger.parameters['searchTerm'] = {
			in: 'query',
			description: 'Search Term',
			required: false,
			type: 'string'
		}
		#swagger.parameters['status'] = {
			in: 'query',
			description: 'Filter by status',
			required: false,
			schema: [''],
			style: 'form',
			explode: true
		}
		#swagger.parameters['under18'] = {
			in: 'query',
			description: 'Filter by under18',
			required: false,
			type: 'boolean'
		}
		#swagger.parameters['sortBy'] = {
			in: 'query',
			description: 'Sort by field. +field for ASC, -field for DESC',
			required: false,
			type: 'string'
		}
        #swagger.responses[200] = {
            description: 'Representations',
            schema: {
				page: 1,
				pageSize: 25,
				pageCount: 1,
				itemCount: 100,
				items:  [
					{
						id: 1,
						reference: 'BC0110001-2',
						status: 'VALID',
						redacted: true,
						received: '2023-03-14T14:28:25.704Z',
						firstName: 'James',
						lastName: 'Bond',
						organisationName: 'MI6'
					}
				]
			}
		}
    */
	validateApplicationId,
	validateGetRepresentationsQuery,
	asyncHandler(getApplicationRepresentations)
);

router.get(
	'/:id/representations/:repId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations/{repId}'
        #swagger.description = 'Gets a representation on an application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['repId'] = {
            in: 'path',
			description: 'Representation ID',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'Representation',
            schema: {
				id: 1,
				reference: 'BC0110001-2',
				status: 'VALID',
				redacted: true,
				received: '2023-03-14T14:28:25.704Z',
				originalRepresentation: '',
				redactedRepresentation: '',
				redactedBy: {},
				contacts: [],
				attachments: []
			}
		}
    */
	validateApplicationId,
	validateRepresentationId,
	asyncHandler(getApplicationRepresentation)
);

router.post(
	'/:id/representations',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations'
        #swagger.description = 'Creates a representation for an application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Representation Details',
            schema: {
				status: 'DRAFT',
				redacted: false,
				received: '2023-03-14T14:28:25.704Z',
				originalRepresentation: 'This is the representation text',
				represented: {
					firstName: 'Peter',
					lastName: 'Biggins',
					organisationName: '',
				    jobTitle: '',
				    email: 'peter.bigins@dummy.email',
				    phoneNumber: '0123456789',
				    address: {
						addressLine1: '',
						addressLine2: '',
						town: '',
						county: '',
						postcode: ''
						},
					type: 'PERSON',
					under18: false
				},
				representative: {}
			}
        }
        #swagger.responses[200] = {
            description: 'Representation',
            schema: {
				id: 1,
				status: 'DRAFT',
			}
		}
    */
	validateApplicationId,
	validateCreateRepresentation,
	asyncHandler(createApplicationRepresentation)
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

export { router as applicationRoutes };
