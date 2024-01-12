import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import {
	validateApplicationId,
	validateCreateRepresentation,
	validateGetRepresentationsQuery,
	validateRepresentationId
} from '../application.validators.js';
import { representaionsRedactRouter } from './redact/redact.route.js';
import {
	createRepresentation,
	getRepresentation,
	getRepresentations,
	patchRepresentation
} from './representations.controller.js';
import { representationPatchValidator } from './representation.validators.js';
import { representationsAttachmentRouter } from './attachment/attachment.route.js';
import { representationsStatusRouter } from './status/status.route.js';
import { getRepDownloadRouter } from './download/rep-download.router.js';
import { representationsPublishableRouter } from './publishable/publishable.route.js';
import { representationsPublishRouter } from './publish/publish.route.js';

const router = createRouter({ mergeParams: true });

router.get(
	'/',
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
											"$ref": '#/definitions/RepresentationSummary'
									}
							]
					}
			}
	*/
	validateApplicationId,
	validateGetRepresentationsQuery,
	asyncHandler(getRepresentations)
);

router.use('/download', getRepDownloadRouter);

router.use('/publishable', representationsPublishableRouter);

router.use('/publish', representationsPublishRouter);

router.get(
	'/:repId',
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
							represented: {},
							representative: {},
							attachments: []
					}
			}
	*/
	validateApplicationId,
	validateRepresentationId,
	asyncHandler(getRepresentation)
);

router.post(
	'/',
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
							representedType: 'PERSON',
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
											postcode: '',
											country: ''
											},
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
	asyncHandler(createRepresentation)
);

router.patch(
	'/:repId',
	/*
			#swagger.tags = ['Applications']
			#swagger.path = '/applications/{id}/representations/{repId}'
			#swagger.description = 'Updates a representation for an application'
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
							redactedBy: 'A users name who has performed a redaction',
							redactedNotes: 'A string if redacted text',
							received: '2023-03-14T14:28:25.704Z',
							originalRepresentation: 'This is the representation text',
							representedType: 'PERSON',
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
											postcode: '',
											country: ''
											},
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
	representationPatchValidator,
	asyncHandler(patchRepresentation)
);

router.use('/:repId/redact', representaionsRedactRouter);

router.use('/:repId/attachment', representationsAttachmentRouter);
router.use('/:repId/status', representationsStatusRouter);

export const representaionsRouter = router;
