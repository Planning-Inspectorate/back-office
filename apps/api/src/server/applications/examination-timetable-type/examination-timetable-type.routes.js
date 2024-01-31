import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { getExaminationTimetableTypes } from './examination-timetable-type.controller.js';

const router = createRouter();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-type'
        #swagger.description = 'Gets all examination timetable types available'
        #swagger.responses[200] = {
            description: 'List of examination timetable types',
            schema: { $ref: '#/definitions/ExaminationTimetableTypes' }
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
    */
	asyncHandler(getExaminationTimetableTypes)
);

export { router as examinationTimetableTypeRoutes };
