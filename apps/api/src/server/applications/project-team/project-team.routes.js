import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import {
	getProjectTeamMembers,
	getProjectTeamMemberById,
	updateProjectTeamMemberRole,
	removeProjectTeamMember
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
		#swagger.responses[404] = {
			description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
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
			type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Project team member',
            schema: { $ref: '#/definitions/ProjectTeamMember' }
        }
		#swagger.responses[404] = {
			description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
		}
    */
	validateApplicationId,
	asyncHandler(getProjectTeamMemberById)
);

router.post(
	'/:id/project-team/remove-member',
	/*
			#swagger.tags = ['Applications']
			#swagger.path = '/applications/{id}/project-team/remove-member'
			#swagger.description = 'Remove team member from project'
			#swagger.parameters['id'] = {
				in: 'path',
				description: 'Application case ID',
				required: true,
				type: 'integer'
			}
			#swagger.parameters['userId'] = {
				in: 'body',
				description: 'Id of the user being removed',
				required: true,
				schema: { $ref: '#/definitions/UserGuidPayload' },
			}
			#swagger.responses[200] = {
				description: 'Project team member',
				schema: { $ref: '#/definitions/ProjectTeamMember' }
			}
			#swagger.responses[404] = {
				description: 'Error: Not Found',
				schema: { errors: { id: "Must be an existing application" } }
			}
		*/
	validateApplicationId,
	asyncHandler(removeProjectTeamMember)
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
				schema: { $ref: '#/definitions/UserRolePayload' },
			}
			#swagger.responses[200] = {
				description: 'Project team member',
				schema: { $ref: '#/definitions/ProjectTeamMember' }
			}
			#swagger.responses[404] = {
				description: 'Error: Not Found',
				schema: { errors: { id: "Must be an existing application" } }
			}
		*/
	validateApplicationId,
	asyncHandler(updateProjectTeamMemberRole)
);

export { router as projectTeamRoutes };
