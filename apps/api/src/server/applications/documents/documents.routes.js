import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from '../../middleware/trim-unexpected-request-parameters.js';
import { validateApplicationId } from '../application/application.validators.js';
import { provideDocumentUploadURLs, updateDocumentStatus } from './documents.controller.js';
import {
	validateDocumentGUID,
	validateDocumentsToUploadProvided,
	validateFolderIds,
	validateMachineAction
} from './documents.validators.js';

const router = createRouter({ mergeParams: true });

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents'
        #swagger.description = 'Saves new documents to database and returns location in Blob Storage'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Document Details',
            schema: { $ref: '#/definitions/documentsToSave' }
        }
        #swagger.responses[200] = {
            description: 'Documents that have been saved',
            schema: { $ref: '#/definitions/documentsAndBlobStorageURLs' }
        }
	 */
	validateApplicationId,
	validateDocumentsToUploadProvided,
	validateFolderIds,
	trimUnexpectedRequestParameters,
	asyncHandler(provideDocumentUploadURLs)
);

router.patch(
	'/:documentGUID/status',
	/*
        #swagger.tags = ['Applications']
        #swagger.path =  'applications/{id}/documents/{documentGUID}/status'
        #swagger.description = 'Updates document status from state machine'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Case ID here',
			required: true,
			type: 'integer'
        }
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

export { router as documentsRoutes };
