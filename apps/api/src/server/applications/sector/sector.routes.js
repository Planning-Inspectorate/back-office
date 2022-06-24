import express from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getSectors } from './sector.controller.js';

const router = new express.Router();

router.get(
	'/',
	/*
	 */
	asyncHandler(getSectors)
);

export { router as sectorRoutes };
