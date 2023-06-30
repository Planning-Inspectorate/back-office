import { Router as createRouter } from 'express';
import { validateApplicationId, validateRepresentationId } from '../../application.validators.js';
import { patchRepresentationStatus } from './status.controller.js';
import { representationPatchStatusValidator } from './status.validator.js';

const router = createRouter({ mergeParams: true });

router.patch(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations/{repId}/status'
        #swagger.description = 'Update a representation status for an application and create an action'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		},
				#swagger.parameters['body'] = {
            in: 'body',
            description: 'Status body to update a rep stats and create a rep action',
            schema: {
            status: 'INVALID',
            notes: "some notes",
            updatedBy: "Joe Bloggs",
            invalidReason: "Duplicate"
            referredTo: "Inspector"
            }
        }
        #swagger.responses[200] = {
            description: 'Representation',
            schema: {
				repId: 1,
				status: "INVALID"
			}
		}
    */
	validateApplicationId,
	validateRepresentationId,
	representationPatchStatusValidator,
	patchRepresentationStatus
);

export const representationsStatusRouter = router;
