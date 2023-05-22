import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getExaminationTimetableItems } from './examination-timetable-items.controller.js';

const router = createRouter();

router.get(
	'/:caseId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items'
        #swagger.description = 'Gets all examination timetable items for case'
        #swagger.parameters['caseId'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'List of examination timetable items',
            schema: { $ref: '#/definitions/ExaminationTimetableItems' }
        }
    */
	asyncHandler(getExaminationTimetableItems)
);

export { router as examinationTimetableItemsRoutes };
