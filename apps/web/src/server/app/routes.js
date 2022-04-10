import express from 'express';
import appRoutes from './app.route.js';
import { registerInspectorLocals } from './inspector/inspector.pipes.js';
import inspectorRouter from './inspector/inspector.router.js';
import { registerLpaLocals } from './lpa/lpa.pipes.js';
import lpaRouter from './lpa/lpa.router.js';
import { registerValidationLocals } from './validation/validation.pipes.js';
import validationRouter from './validation/validation.router.js';

const router = express.Router();

// Mount app routes at / (this includes all sub paths specific to the general app)
router.use('/', appRoutes);
// Mount all validation step routes at `/validation` (these will be seen by validation officers)
router.use('/validation', [registerValidationLocals, validationRouter]);
// Mount all LPA step routes at `/lpa` (these will be seen by case officers)
router.use('/lpa', [registerLpaLocals, lpaRouter]);

router.use('/inspector', [registerInspectorLocals, inspectorRouter]);

export { router as routes };
