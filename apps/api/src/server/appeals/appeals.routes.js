import { Router as createRouter } from 'express';
import { CaseTeamRoutes } from './case-team/case-team.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';
import { validationRoutes } from './validation/validation.routes.js';

const router = createRouter();

router.use('/validation', validationRoutes);

router.use('/case-team', CaseTeamRoutes);

router.use('/inspector', inspectorRoutes);

export { router as appealsRoutes };
