import express from 'express';
import { getValidation,  getAppealReview } from './validation.controller.js';

const router = express.Router();

router.get('/', getValidation);
router.get('/:id', getAppealReview);

export {
	router as validationRoutes
};
