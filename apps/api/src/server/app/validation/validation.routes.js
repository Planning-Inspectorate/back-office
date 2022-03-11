import express from 'express';
import { getValidation,  getAppealReview, updateValidation } from './validation.controller.js';

const router = express.Router();

router.get('/', getValidation);
router.get('/:id', getAppealReview);
router.patch('/:id', updateValidation)

export {
	router as validationRoutes
};
