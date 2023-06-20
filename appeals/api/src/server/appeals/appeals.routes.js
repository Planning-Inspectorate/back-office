import { Router as createRouter } from 'express';
import { appealsRoutes } from './appeals/appeals.routes.js';

const router = createRouter();

router.use('/', appealsRoutes);

export { router as appealsRoutes };
