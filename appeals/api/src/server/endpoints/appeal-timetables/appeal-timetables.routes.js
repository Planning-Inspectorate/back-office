import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { updateAppealTimetableById } from './appeal-timetables.controller.js';
import { checkAppealExistsByIdAndAddToRequest } from '#middleware/check-appeal-exists-and-add-to-request.js';
import { patchAppealTimetableValidator } from './appeal-timetables.validators.js';
import { checkAppealTimetableExists } from './appeal-timetables.service.js';

const router = createRouter();

router.patch(
	'/:appealId/appeal-timetables/:appealTimetableId',
	/*
		#swagger.tags = ['Appeal Timetables']
		#swagger.path = '/appeals/{appealId}/appeal-timetables/{appealTimetableId}'
		#swagger.description = 'Updates a single appeal timetable by id'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal timetable details to update',
			schema: { $ref: '#/definitions/UpdateAppealTimetableRequest' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Updates a single appeal timetable by id',
			schema: { $ref: '#/definitions/UpdateAppealTimetableResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[500] = {}
	 */
	checkAppealExistsByIdAndAddToRequest,
	checkAppealTimetableExists,
	patchAppealTimetableValidator,
	asyncHandler(updateAppealTimetableById)
);

export { router as appealTimetablesRoutes };
