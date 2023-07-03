import { Router as createRouter } from 'express';
import { patchRepresentationRedact } from './redact.controller.js';
import { validateRedactedRepresentation } from './redact.validators.js';
import { validateApplicationId } from '../../application.validators.js';

const router = createRouter({ mergeParams: true });

router.patch(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations/{repId}/redact'
        #swagger.description = 'Redact a representation for an application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Representation redact details \n type can be REDACT_STATUS or REDACT. If REDACT_STATUS then redactedRepresentation is not a mandatory field but redactStatus will be.',
            schema: {
	          actionBy: "Joe Bloggs",
						redactedRepresentation: "This is the original Rep",
            notes: "Removed PII from original",
            type: 'REDACTION',
            redacted: true,
            redactStatus: true,

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
	validateRedactedRepresentation,
	patchRepresentationRedact
);

export const representaionsRedactRouter = router;
