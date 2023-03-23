import { Router as createRouter } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from '../middleware/trim-unexpected-request-parameters.js';
import {
	createApplication,
	getApplicationDetails,
	getApplicationRepresentations,
	publishCase,
	startCase,
	updateApplication
} from './application/application.controller.js';
import {
	validateApplicantId,
	validateApplicationId,
	validateCreateUpdateApplication,
	validateGetApplicationQuery,
	validateGetRepresentationsQuery
} from './application/application.validators.js';
import { documentRoutes } from './application/documents/document.routes.js';
import { fileFoldersRoutes } from './application/file-folders/folders.routes.js';
import { caseAdminOfficerRoutes } from './case-admin-officer/case-admin-officer.routes.js';
import { caseTeamRoutes } from './case-team/case-team.routes.js';
import { updateDocumentStatus } from './documents/documents.controller.js';
import { validateDocumentGUID, validateMachineAction } from './documents/documents.validators.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';
import { regionRoutes } from './region/region.routes.js';
import { caseSearchRoutes } from './search/case-search.routes.js';
import { sectorRoutes } from './sector/sector.routes.js';
import { zoomLevelRoutes } from './zoom-level/zoom-level.routes.js';

const router = createRouter();

router.use('/case-team', caseTeamRoutes);

router.use('/case-admin-officer', caseAdminOfficerRoutes);

router.use('/inspector', inspectorRoutes);

router.use('/region', regionRoutes);

router.use('/sector', sectorRoutes);

router.use('/search', caseSearchRoutes);

router.use('/zoom-level', zoomLevelRoutes);

router.use('/', documentRoutes);

router.use('/', fileFoldersRoutes);

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

router.patch(
	'/documents/:documentGUID/status',
	/*
        #swagger.tags = ['Applications']
        #swagger.path =  'applications/documents/{documentGUID}/status'
        #swagger.description = 'Updates document status from state machine'
        #swagger.parameters['documentGUID'] = {
            in: 'path',
            description: 'Document GUID',
			required: true,
			type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Document status updated',
            schema: { caseId: 1, guid: 'DB0110203', status: 'awaiting_virus_check'}
        }
	 */
	validateDocumentGUID,
	validateMachineAction,
	trimUnexpectedRequestParameters,
	asyncHandler(updateDocumentStatus)
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
			description: 'Application ID here',
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

router.get(
	'/:id/representations',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations'
        #swagger.description = 'Gets list of representations on a case'
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
			maximun: 100
		}
		#swagger.parameters['searchTerm'] = {
            in: 'query',
			description: 'Search Term',
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
						originalRepresentation: 'I wish to object to this planning application.',
						redactedRepresentation: 'I wish to object to this planning application',
						redacted: true,
						received: '2023-03-14T14:28:25.704Z'
					}
				]
			}
		}
    */
	validateApplicationId,
	validateGetApplicationQuery,
	validateGetRepresentationsQuery,
	asyncHandler(getApplicationRepresentations)
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

export { router as applicationsRoutes };
