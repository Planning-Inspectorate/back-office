import express from 'express';
import { getValidation,  getAppealToValidate, updateValidation, appealValidated } from './validation.controller.js';
import { body } from 'express-validator';
import asyncHandler from '../middleware/async-handler.js';

const router = express.Router();

router.get('/', asyncHandler(getValidation));
router.get('/:id', asyncHandler(getAppealToValidate));
router.patch('/:id', body('AppellantName').isAlpha('en-US', { ignore: ' ' } ), asyncHandler(updateValidation));
router.post('/:id', asyncHandler(appealValidated));

export {
	router as validationRoutes
};
