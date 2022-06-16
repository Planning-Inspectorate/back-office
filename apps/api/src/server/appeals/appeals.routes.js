import express from 'express';
import { caseOfficerRoutes } from './case-officer/case-officer.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';
import { validationRoutes } from './validation/validation.routes.js';

const router = new express.Router();

router.use(
	'/validation',
	validationRoutes
);

router.use(
	'/case-officer',
	caseOfficerRoutes
);

router.use(
	'/inspector',
	inspectorRoutes
);

export { router as appealsRoutes };
