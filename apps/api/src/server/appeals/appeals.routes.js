import express from 'express';
import config from '../config/config.js';
import { caseOfficerRoutes } from './case-officer/case-officer.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';
import versionRoutes from './middleware/version-routes.js';
import { validationRoutes } from './validation/validation.routes.js';

const router = new express.Router();

import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';

const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));

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
