import { Router as createRouter } from 'express';
import { appealsRoutes } from './appeals/appeals.routes.js';
import { caseOfficerRoutes } from './case-officer/case-officer.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';
import { validationRoutes } from './validation/validation.routes.js';

const router = createRouter();

router.use('/', appealsRoutes);

router.use('/validation', validationRoutes);

router.use('/case-officer', caseOfficerRoutes);

router.use('/inspector', inspectorRoutes);

export { router as appealsRoutes };
