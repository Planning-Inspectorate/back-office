import config from '@pins/web/environment/config.js';
import { Router as createRouter } from 'express';
import { viewHomepage, viewUnauthenticatedError } from './app.controller.js';
import { assertGroupAccess, assertIsAuthenticated } from './auth/auth.guards.js';
import authRouter from './auth/auth.router.js';
import { registerInspectorLocals } from './inspector/inspector.pipes.js';
import inspectorRouter from './inspector/inspector.router.js';
import { registerLpaLocals } from './lpa/lpa.pipes.js';
import lpaRouter from './lpa/lpa.router.js';
import { registerValidationLocals } from './validation/validation.pipes.js';
import validationRouter from './validation/validation.router.js';

const router = createRouter();

router.use(authRouter);

// Mount app routes at / (this includes all sub paths specific to the general app)

router.route('/').get(assertIsAuthenticated, viewHomepage);
router.route('/unauthenticated').get(viewUnauthenticatedError);

// Mount all validation step routes at `/validation` (these will be seen by validation officers)
router.use(
	'/validation',
	assertIsAuthenticated,
	assertGroupAccess(config.referenceData.groups.validationOfficerGroupId),
	registerValidationLocals,
	validationRouter
);

// Mount all LPA step routes at `/lpa` (these will be seen by case officers)
router.use(
	'/lpa',
	assertIsAuthenticated,
	assertGroupAccess(config.referenceData.groups.caseOfficerGroupId),
	registerLpaLocals,
	lpaRouter
);

// Mount all inspector step routes at `/inspector` (these will be seen by inspectors)
router.use(
	'/inspector',
	assertIsAuthenticated,
	assertGroupAccess(config.referenceData.groups.inspectorGroupId),
	registerInspectorLocals,
	inspectorRouter
);

// GET /health-check - Check service health
router.route('/health-check').get((request, response) => {
	response.send('OK');
});

export default router;
