import { Router as createRouter } from 'express';
import { validateApplicationId, validateRepresentationId } from '../../application.validators.js';
import { deleteRepresentationContact } from './contacts.controller.js';

const router = createRouter({ mergeParams: true });

router.delete(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/representations/{repId}/contacts/{contactId}'
        #swagger.description = 'Delete a representation contact for an application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        }
        #swagger.responses[200] = {
            description: 'Representation',
            schema: {
				contactId: 1,
			}
		}
    */
	validateApplicationId,
	validateRepresentationId,
	deleteRepresentationContact
);

export const representationsContactsRouter = router;
