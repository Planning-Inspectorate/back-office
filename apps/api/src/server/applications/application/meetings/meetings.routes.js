import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import {
	createMeeting,
	deleteMeeting,
	getManyMeetings,
	getMeeting,
	patchMeeting
} from './meetings.controller.js';
import { validateApplicationId } from '../application.validators.js';
import { validateCreateMeeting, validatePatchMeeting } from './meetings.validators.js';

const router = createRouter({ mergeParams: true });

router.get(
	'/',
	/*
		#swagger.tags = ['Applications/Meetings']
		#swagger.path = '/applications/{id}/meetings'
		#swagger.description = 'Gets all meetings for an application'
		#swagger.parameters['id'] = {
				in: 'path',
				description: 'Application ID',
				required: true,
				type: 'integer'
		}
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
		#swagger.responses[200] = {
			description: 'List of meetings for the application',
			schema: { [
					{
						$ref: '#/definitions/Meeting'
					}
			] }
		}
		#swagger.responses[404] = {
			description: 'Error not found',
			schema: { errors: { id: "Must be an existing application" } }
		}
	 */
	validateApplicationId,
	asyncHandler(getManyMeetings)
);

router.post(
	'/',
	/*
		#swagger.tags = ['Applications/Meetings']
		#swagger.path = '/applications/{id}/meetings'
		#swagger.description = 'Creates a new meeting for an application'
		#swagger.parameters['id'] = {
				in: 'path',
				description: 'Application ID',
				required: true,
				type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Meeting Details',
			schema: {
				agenda: 'This is a meeting agenda',
				pinsRole: 'Observer',
				meetingDate: '2024-07-01T10:00:00Z',
				meetingType: 'Pre-application'
			},
			required: true
		}
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
		#swagger.responses[201] = {
			description: 'Body of created meeting',
			schema: { $ref: '#/definitions/Meeting' }
		}
	 */
	validateApplicationId,
	validateCreateMeeting,
	asyncHandler(createMeeting)
);

router.get(
	'/:meetingId',
	/*
	#swagger.tags = ['Applications/Meetings']
	#swagger.path = '/applications/{id}/meetings/{meetingId}'
	#swagger.description = 'Gets specific meeting for an application'
	#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
	}
	#swagger.parameters['meetingId'] = {
			in: 'path',
			description: 'Meeting ID',
			required: true,
			type: 'integer'
	}
	#swagger.parameters['x-service-name'] = {
		in: 'header',
		type: 'string',
		description: 'Service name header',
		default: 'swagger'
	}
	#swagger.parameters['x-api-key'] = {
		in: 'header',
		type: 'string',
		description: 'API key header',
		default: '123'
	}
	#swagger.responses[200] = {
		description: 'Specific meeting requested',
		schema: { $ref: '#/definitions/Meeting' }
	}
	#swagger.responses[404] = {
		description: 'Error not found',
		schema: { errors: { id: "Must be an existing application" } }
	}
 */
	validateApplicationId,
	asyncHandler(getMeeting)
);

router.patch(
	'/:meetingId',
	/*
	#swagger.tags = ['Applications/Meetings']
	#swagger.path = '/applications/{id}/meetings/{meetingId}'
	#swagger.description = 'Updates a specific meeting for an application'
	#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
	}
	#swagger.parameters['meetingId'] = {
			in: 'path',
			description: 'Meeting ID',
			required: true,
			type: 'integer'
	}
	#swagger.parameters['body'] = {
		in: 'body',
		description: 'Meeting Details to update',
		schema: {
			agenda: 'This is an updated meeting agenda',
			pinsRole: 'Advisor',
			meetingDate: '2024-07-02T11:00:00Z',
			meetingType: 'Pre-application'
		},
		required: true
	}
	#swagger.parameters['x-service-name'] = {
		in: 'header',
		type: 'string',
		description: 'Service name header',
		default: 'swagger'
	}
	#swagger.parameters['x-api-key'] = {
		in: 'header',
		type: 'string',
		description: 'API key header',
		default: '123'
	}
	#swagger.responses[200] = {
		description: 'Body of updated meeting',
		schema: { $ref: '#/definitions/Meeting' }
	}
 */
	validateApplicationId,
	validatePatchMeeting,
	asyncHandler(patchMeeting)
);

router.delete(
	'/:meetingId',
	/*
	#swagger.tags = ['Applications/Meetings']
	#swagger.path = '/applications/{id}/meetings/{meetingId}'
	#swagger.description = 'Deletes a specific meeting for an application'
	#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
	}
	#swagger.parameters['meetingId'] = {
			in: 'path',
			description: 'Meeting ID',
			required: true,
			type: 'integer'
	}
	#swagger.parameters['x-service-name'] = {
		in: 'header',
		type: 'string',
		description: 'Service name header',
		default: 'swagger'
	}
	#swagger.parameters['x-api-key'] = {
		in: 'header',
		type: 'string',
		description: 'API key header',
		default: '123'
	}
	#swagger.responses[204] = {
		description: 'Meeting deleted successfully'
	}
 */
	validateApplicationId,
	asyncHandler(deleteMeeting)
);

export const meetingsRouter = router;
