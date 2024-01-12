import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express/middleware/async-handler.js';
import {
	createExaminationTimetableItem,
	getExaminationTimetableItem,
	getExaminationTimetableItems,
	publishExaminationTimetable,
	unpublishExaminationTimetable,
	deleteExaminationTimetableItem,
	updateExaminationTimetableItem
} from './examination-timetable-items.controller.js';
import {
	validateCreateExaminationTimetableItem,
	validateExistingExaminationTimetableItemId,
	validateUpdateExaminationTimetableItem
} from './examination-timetable-items.validators.js';
import { validateApplicationId } from '../application/application.validators.js';

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
            schema: { $ref: '#/definitions/ExaminationTimetableWithItems' }
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
            schema: { $ref: '#/definitions/ExaminationTimetableItemWithExamTimetable' }
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
            description: 'New examination timetable item',
            schema: { $ref: '#/definitions/ExaminationTimetableItemCreateRequestBody' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Created examination timetable item',
            schema: { $ref: '#/definitions/ExaminationTimetableItemSaveResponse' }
        }
		#swagger.responses[400] = {
            description: 'Bad Request',
            schema: { $ref: '#/definitions/ExaminationTimetableItemSaveBadRequest' }
        }
    */
	validateCreateExaminationTimetableItem,
	asyncHandler(createExaminationTimetableItem)
);

router.patch(
	'/publish/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items/publish/{id}'
        #swagger.description = 'Publish examination timetable items for the case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Examination timetable items published',
			schema: { success: true } }
        }
    */
	validateApplicationId,
	asyncHandler(publishExaminationTimetable)
);

router.patch(
	'/unpublish/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items/unpublish/{id}'
        #swagger.description = 'Unpublish examination timetable items for the case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Examination timetable items unpublished',
			schema: { success: true } }
        }
    */
	validateApplicationId,
	asyncHandler(unpublishExaminationTimetable)
);

router.delete(
	'/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items/{id}'
        #swagger.description = 'Delete examination timetable item by id'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Examination timetable item ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['body'] = {}
        #swagger.responses[200] = {
            description: 'Examination timetable item successfully deleted',
        }
    */
	asyncHandler(deleteExaminationTimetableItem)
);

router.patch(
	'/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/examination-timetable-items/{id}'
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
            schema: { $ref: '#/definitions/ExaminationTimetableItemUpdateRequestBody' },
			required: true
        }
        #swagger.responses[200] = {
            description: 'Examination timetable item',
            schema: { $ref: '#/definitions/ExaminationTimetableItemSaveResponse' }
        }
		#swagger.responses[400] = {
            description: 'Example of an error response',
            schema: { errors: { id: "Must be an existing examination timetable item" } }
        }
    */
	validateExistingExaminationTimetableItemId,
	validateUpdateExaminationTimetableItem,
	asyncHandler(updateExaminationTimetableItem)
);

export { router as examinationTimetableItemRoutes };
