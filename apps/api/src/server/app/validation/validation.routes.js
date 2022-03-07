import express from 'express';
import { getValidation } from './validation.controller.js';

const router = express.Router();

router.get('/', getValidation);

export {
	router as validationRoutes
};
