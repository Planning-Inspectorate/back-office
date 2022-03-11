import express from 'express';
import { getValidation,  getAppealReview, updateValidation } from './validation.controller.js';
// eslint-disable-next-line import/no-unresolved
import { body } from 'express-validator';

const router = express.Router();

router.get('/', getValidation);
router.get('/:id', getAppealReview);
router.patch('/:id', body('AppellantName').isAlpha('en-US', { ignore: ' ' } ), updateValidation);

export {
	router as validationRoutes
};
