import express from 'express';
import { getAppeals } from './lpa-questionnaire.get-appeals.controller.js';

const router = express.Router();

router.get('/', getAppeals);

export {
	router as appealWithQUestionnaireRoutes
};
