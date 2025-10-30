import { Router as createRouter } from 'express';
import { patchRepresentationEdit } from './edit.controller.js';
import { validateEditedRepresentation } from './edit.validators.js';
import { validateApplicationId } from '../../application.validators.js';

const router = createRouter({ mergeParams: true });

router.patch(
	'/',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{id}/representations/{repId}/redact'
		#swagger.description = 'Edit a representation for an application'
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			description: 'Service name header',
			required: false,
			type: 'string',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			description: 'API key header',
			required: false,
			type: 'string',
			default: '123'
		}
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Edited representation details \n notes can be blank.',
			schema: {
				editedRepresentation: 'This is the edited representation',
				editNotes: 'Some notes about the edit',
				actionBy: 'Name of the user making the edit',
			}
		}
		#swagger.responses[200] = {
			description: 'Representation',
			schema: {
				id: 1,
				editedRepresentation: 'This is the edited representation,
			}
		}
	*/
	validateApplicationId,
	validateEditedRepresentation,
	patchRepresentationEdit
);

export const representationsEditRouter = router;
