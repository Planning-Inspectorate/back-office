import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import {
	getProjectTeamMembers,
	getProjectTeamMemberById,
	updateProjectTeamMemberRole
} from './project-team.controller.js';
import { validateApplicationId } from '../application/application.validators.js';

const router = createRouter();

router.get(
	'/:id/project-team',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/project-team'
        #swagger.description = 'Gets all project team members of a case '
		#swagger.parameters['id'] = {
            in: 'path',
			description: 'Application case ID',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'List of project team members',
            schema: { $ref: '#/definitions/ProjectTeamMembers' }
        }
    */
	validateApplicationId,
	asyncHandler(getProjectTeamMembers)
);

router.get(
	'/:id/project-team/:userId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/project-team/{userId}'
        #swagger.description = 'Gets project team member by azure reference id'
		#swagger.parameters['id'] = {
            in: 'path',
			description: 'Application case ID',
			required: true,
			type: 'integer'
        }
		#swagger.parameters['userId'] = {
            in: 'path',
			description: 'Azure reference for the user',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Project team member',
            schema: { $ref: '#/definitions/ProjectTeamMember' }
        }
    */
	validateApplicationId,
	asyncHandler(getProjectTeamMemberById)
);

router.patch(
	'/:id/project-team/:userId',
	/*
			#swagger.tags = ['Applications']
			#swagger.path = '/applications/{id}/project-team/{userId}'
			#swagger.description = 'Change role of project team member'
			#swagger.parameters['id'] = {
				in: 'path',
				description: 'Application case ID',
				required: true,
				type: 'integer'
			}
			#swagger.parameters['userId'] = {
				in: 'path',
				description: 'Azure reference for the user',
				required: true,
				type: 'string'
			}
			#swagger.parameters['role'] = {
				in: 'body',
				description: 'New role',
				required: true,
				type: 'string'
			}
			#swagger.responses[200] = {
				description: 'Project team member',
				schema: { $ref: '#/definitions/ProjectTeamMember' }
			}
		*/
	validateApplicationId,
	asyncHandler(updateProjectTeamMemberRole)
);

export { router as projectTeamRoutes };