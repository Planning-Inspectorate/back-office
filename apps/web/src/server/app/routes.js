import express from 'express';
import appRoutes from './app.route.js';
import validationRoutes from './validation/validation.route.js';
import { registerValidationLocals } from './validation/validation.pipes.js';
import lpaRoutes from './lpa/lpa.route.js';
import inspectorRoutes from './inspector/inspector.route.js';
import { registerInspectorLocals } from './inspector/inspector.pipes.js';

const router = express.Router();

// TODO: move to `lpa/lpa.pipes.js` once James's work is merged
const registerLpaLocals = (_, response, next) => {
	response.locals.serviceName = 'Appeal a planning decision';
	response.locals.serviceUrl = '/lpa';
	next();
};

// Mount app routes at / (this includes all sub paths specific to the general app)
router.use('/', appRoutes);
// Mount all validation step routes at `/validation` (these will be seen by validation officers)
router.use('/validation', [registerValidationLocals, validationRoutes]);
// Mount all LPA step routes at `/lpa` (these will be seen by case officers)
router.use('/lpa', [registerLpaLocals, lpaRoutes]);

router.use('/inspector', [registerInspectorLocals, inspectorRoutes]);

export { router as routes };
