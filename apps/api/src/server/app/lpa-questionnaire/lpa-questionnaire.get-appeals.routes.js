import express from 'express';
import asyncHandler from '../middleware/async-handler.js';
import { getAppeals, getAppealsDetail, confirmingLPAQuestionnaire } from './lpa-questionnaire.get-appeals.controller.js';

const router = express.Router();

router.get('/', getAppeals);
router.get('/:id', getAppealsDetail);
router.post('/:id/confirm', asyncHandler(confirmingLPAQuestionnaire));


export {
	router as caseOfficerRoutes
};
