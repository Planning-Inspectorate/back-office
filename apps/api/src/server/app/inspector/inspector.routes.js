import express from 'express';
import asyncHandler from '../middleware/async-handler.js';
import { getAppeals } from './inspector.controller.js';

const router = express.Router();

router.get('/', asyncHandler(getAppeals));

export { router as inspectorRoutes };
