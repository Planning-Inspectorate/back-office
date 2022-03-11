import express from 'express';
import { getValidation,  getAppealReview, updateValidation, appealValidated } from './validation.controller.js';
// eslint-disable-next-line import/no-unresolved
import { body } from 'express-validator';

const router = express.Router();

router.get('/', getValidation);
router.get('/:id', getAppealReview);
router.patch('/:id', body('AppellantName').isAlpha('en-US', { ignore: ' ' } ), updateValidation);
router.post(':id', appealValidated);

export {
	router as validationRoutes
};
