import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import {
	createExaminationTimetableItem,
	getExaminationTimetableItem,
	getExaminationTimetableItems
} from './examination-timetable-items.controller.js';
import { validateCreateExaminationTimetableItem } from './examination-timetable-items.validators.js';

const router = createRouter();

router.get(
	'/case/:caseId',
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

router.get(
	'/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items'
        #swagger.description = 'Gets all examination timetable items for case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Examination timetable item ID',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'List of examination timetable items',
            schema: { $ref: '#/definitions/ExaminationTimetableItemsResponseBody' }
        }
    */
	asyncHandler(getExaminationTimetableItem)
);

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items'
        #swagger.description = 'Gets all examination timetable items for case'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'document pagination parameters',
            schema: { $ref: '#/definitions/ExaminationTimetableItemsRequestBody' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'List of examination timetable items',
            schema: { $ref: '#/definitions/ExaminationTimetableItemsResponseBody' }
        }
    */
	validateCreateExaminationTimetableItem,
	asyncHandler(createExaminationTimetableItem)
);

export { router as examinationTimetableItemRoutes };
