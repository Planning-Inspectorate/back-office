import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
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
    */
	asyncHandler(getExaminationTimetableTypes)
);

export { router as examinationTimetableTypeRoutes };
