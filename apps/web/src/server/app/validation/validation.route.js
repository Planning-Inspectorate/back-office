import express from 'express';
import { getValidationDashboard, getAppealDetails } from './validation.controller.js';

const router = express.Router();

router.route('/')
	.get(getValidationDashboard);

router.route('/appeal/:appealId')
	.get(getAppealDetails);

export default router;
