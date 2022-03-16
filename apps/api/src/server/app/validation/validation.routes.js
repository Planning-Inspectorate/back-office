import express from 'express';
import { getValidation,  getAppealToValidate, updateValidation, appealValidated } from './validation.controller.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/', getValidation);
router.get('/:id', getAppealToValidate);
router.patch('/:id', body('AppellantName').isAlpha('en-US', { ignore: ' ' } ), updateValidation);
router.post('/:id', appealValidated);

export {
	router as validationRoutes
};
