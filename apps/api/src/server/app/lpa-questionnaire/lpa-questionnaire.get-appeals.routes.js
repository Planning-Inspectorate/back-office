import express from 'express';
import { getAppeals, getAppealsDetail } from './lpa-questionnaire.get-appeals.controller.js';

const router = express.Router();

router.get('/', getAppeals);
router.get('/id:', getAppealsDetail);


export {
	router as caseOfficerRoutes
};
