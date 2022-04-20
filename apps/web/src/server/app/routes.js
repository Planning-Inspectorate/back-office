import express from 'express';
import { config } from './../config/config.js';
import appRouter from './app.router.js';
import { isAuthenticated, hasAccess } from './auth/auth.guards.js';
import authRouter from './auth/auth.router.js';
import { registerInspectorLocals } from './inspector/inspector.pipes.js';
import inspectorRouter from './inspector/inspector.router.js';
import { registerLpaLocals } from './lpa/lpa.pipes.js';
import lpaRouter from './lpa/lpa.router.js';
import { registerValidationLocals } from './validation/validation.pipes.js';
import validationRouter from './validation/validation.router.js';

const router = express.Router();

// Mount app routes at / (this includes all sub paths specific to the general app)
router.use('/', appRouter);

// Add authentication check for all routes and mount auth specific routes at /auth
// (this includes all paths / sub paths specific to the auth flow)
router.use('/auth', authRouter);

// Mount all validation step routes at `/validation` (these will be seen by validation officers)
router.use(
	'/validation',
	isAuthenticated,
	hasAccess({ accessRule: { methods: ['GET'], groups: [config.auth.validationOfficerGroupID] } }),
	registerValidationLocals,
	validationRouter
);

// Mount all LPA step routes at `/lpa` (these will be seen by case officers)
router.use(
	'/lpa',
	isAuthenticated,
	hasAccess({ accessRule: { methods: ['GET'], groups: [config.auth.caseOfficerGroupID] } }),
	registerLpaLocals,
	lpaRouter
);

// Mount all inspector step routes at `/inspector` (these will be seen by inspectors)
router.use(
	'/inspector',
	isAuthenticated,
	hasAccess({ accessRule: { methods: ['GET'], groups: [config.auth.inspectorGroupID] } }),
	registerInspectorLocals,
	inspectorRouter
);

export { router as routes };

