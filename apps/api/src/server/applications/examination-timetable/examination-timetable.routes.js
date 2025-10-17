import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { getExaminationTimetableByCaseId } from './examination-timetable.controller.js';

const router = createRouter();

router.get(
	'/case/:caseId',
	/*
				#swagger.tags = ['Applications']
				#swagger.path = '/applications/examination-timetable/case/{caseId}'
				#swagger.description = 'Gets the examination timetable record for a case (no items)'
				#swagger.parameters['caseId'] = {
						in: 'path',
						description: 'Case ID',
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
						description: 'The examination timetable',
						schema: { $ref: '#/definitions/ExaminationTimetable'
				}
	*/
	asyncHandler(getExaminationTimetableByCaseId)
);

export { router as examinationTimetableRoutes };
