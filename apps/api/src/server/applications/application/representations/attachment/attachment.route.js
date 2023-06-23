import { Router as createRouter } from 'express';
import { validateApplicationId, validateRepresentationId } from '../../application.validators.js';
import {
	addRepresentationAttachment,
	deleteRepresentationAttachment
} from './attachment.controller.js';
import { representationAddAttachmentValidator } from './attachment.validator.js';

const router = createRouter({ mergeParams: true });

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations/{repId}/attachment'
        #swagger.description = 'Add a representation attachment for an application document'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		},
				#swagger.parameters['body'] = {
            in: 'body',
            description: 'Document Details',
            schema: {
            documentId: 'a guid',
            }
        }
        #swagger.responses[200] = {
            description: 'Representation',
            schema: {
				attachmentId: 1,
			}
		}
    */
	validateApplicationId,
	validateRepresentationId,
	representationAddAttachmentValidator,
	addRepresentationAttachment
);

router.delete(
	'/:attachmentId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations/{repId}/attachment/{attachmentId}'
        #swagger.description = 'Delete a representation attachment for an application document'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		},
        #swagger.responses[200] = {
            description: 'Attachment',
            schema: {
				attachmentId: 1,
			}
		}
    */
	validateApplicationId,
	validateRepresentationId,
	deleteRepresentationAttachment
);

export const representationsAttachmentRouter = router;
