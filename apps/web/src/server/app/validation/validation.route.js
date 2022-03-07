import express from 'express';
import { getValidationDashboard } from './validation.controller.js';

const router = express.Router();

router.route('/')
	.get(getValidationDashboard);

export default router;
