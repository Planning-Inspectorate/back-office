import express from 'express';
import { caseOfficerRoutes } from './case-officer/case-officer.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';
import versionRoutes from './middleware/version-routes.js';
import { validationRoutes } from './validation/validation.routes.js';

const router = new express.Router();

router.use(
	'/validation',
	versionRoutes({
		1: validationRoutes
	})
);

router.use(
	'/case-officer',
	versionRoutes({
		1: caseOfficerRoutes
	})
);

router.use(
	'/inspector',
	versionRoutes({
		1: inspectorRoutes
	})
);

export { router as appealsRoutes };
