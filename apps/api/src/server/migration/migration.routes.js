import { Router as createRouter } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { postMigrateModel } from './migration.controller.js';

const router = createRouter();

router.post('/:modelType', asyncHandler(postMigrateModel));

export { router as migrationRoutes };
