import express from 'express';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';

import {
	getLpaDashboard
} from './lpa.controller.js';

const router = express.Router();

// Main lpa route `/lpa`
router.route('/').get(getLpaDashboard);

export default router;
