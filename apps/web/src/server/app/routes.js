import express from 'express';
import appRoutes from './app.route.js';
import validationRoutes from './validation/validation.route.js';
import lpaRoutes from './lpa/lpa.route.js';

const router = express.Router();

// Mount app routes at / (this includes all sub paths specific to the general app)
router.use('/', appRoutes);
// Mount all validation step routes at `/validation` (these will be seen by validation officers)
router.use('/validation', validationRoutes);
// Mount all LPA step routes at `/lpa` (these will be seen by case officers)
router.use('/lpa', lpaRoutes);

export {
	router as routes
};
