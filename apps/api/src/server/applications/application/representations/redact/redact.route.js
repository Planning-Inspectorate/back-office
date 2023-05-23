import { Router as createRouter } from 'express';
import { patchRepresentationRedact } from './redact.controller.js';
import { validateRedactedRepresentation } from './redact.validators.js';

const router = createRouter({ mergeParams: true });

router.patch(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations/{repId}/redact'
        #swagger.description = 'Updates a redacted representation for an application'
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
            actionBy: "Joe Bloggs",
						redactedRepresentation: "This is the original Rep",
            notes: "Removed PII from original",
            type: 'REDACTION',
            invalidReason: 'an invalid reason',

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
	validateRedactedRepresentation,
	patchRepresentationRedact
);

export const representaionsRedactRouter = router;
