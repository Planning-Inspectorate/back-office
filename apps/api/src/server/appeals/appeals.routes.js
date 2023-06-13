import { Router as createRouter } from 'express';
import { appealsRoutes } from './appeals/appeals.routes.js';
//import { documentRoutes } from './documents/document.routes.js';

const router = createRouter();

router.use('/', appealsRoutes);
//router.use('/documents', documentRoutes);

export { router as appealsRoutes };
