import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import {
	createExaminationTimetableItem,
	getExaminationTimetableItem,
	getExaminationTimetableItems,
	updateExaminationTimetableItem
} from './examination-timetable-items.controller.js';
import {
	validateCreateExaminationTimetableItem,
	validateUpdateExaminationTimetableItem
} from './examination-timetable-items.validators.js';

const router = createRouter();

router.get(
	'/case/:caseId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items/case/{caseId}'
        #swagger.description = 'Gets all examination timetable items for the case'
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
        #swagger.path = '/applications/examination-timetable-items/{id}'
        #swagger.description = 'Gets examination timetable item by id'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Examination timetable item ID',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Examination timetable item',
            schema: { $ref: '#/definitions/ExaminationTimetableItemResponseBody' }
        }
    */
	asyncHandler(getExaminationTimetableItem)
);

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items'
        #swagger.description = 'Create an examination timetable item for the case'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'document pagination parameters',
            schema: { $ref: '#/definitions/ExaminationTimetableItemRequestBody' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Created examination timetable item',
            schema: { $ref: '#/definitions/ExaminationTimetableItemResponseBody' }
        }
    */
	validateCreateExaminationTimetableItem,
	asyncHandler(createExaminationTimetableItem)
);

router.patch(
	'/:id/update',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items/{id}/update'
        #swagger.description = 'Updates an examination timetable item'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Examination timetable item ID',
			required: true,
			type: 'integer'
        }
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Examination timetable item update details',
            schema: { $ref: '#/definitions/ExaminationTimetableItemRequestBody' },
			required: true
        }
        #swagger.responses[200] = {
            description: 'Examination timetable item',
            schema: { $ref: '#/definitions/ExaminationTimetableItemResponseBody' }
        }
    */
	validateUpdateExaminationTimetableItem,
	asyncHandler(updateExaminationTimetableItem)
);

export { router as examinationTimetableItemRoutes };
