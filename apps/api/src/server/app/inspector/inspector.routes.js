import express from 'express';
import asyncHandler from '../middleware/async-handler.js';
import { getAppeals, assignAppeals } from './inspector.controller.js';

const router = express.Router();

router.get('/', 
	/*
        #swagger.description = 'Gets appeals assigned to inspector'
        #swagger.parameters['userid'] = {
            in: 'header',
            type: 'integer',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Appeals that are assigned to inspector',
            schema: { $ref: '#/definitions/AppealsForInspector' }
        }
    */
	asyncHandler(getAppeals));

router.post('/assign', asyncHandler(assignAppeals));

export { router as inspectorRoutes };
