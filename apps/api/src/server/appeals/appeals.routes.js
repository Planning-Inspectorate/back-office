import { Router as createRouter } from 'express';
import { appealsRoutes } from './appeals/appeals.routes.js';
import { appellantCaseIncompleteReasonsRoutes } from './appellant-case-incomplete-reasons/appellant-case-incomplete-reasons.routes.js';
import { appellantCaseInvalidReasonsRoutes } from './appellant-case-invalid-reasons/appellant-case-invalid-reasons.routes.js';

const router = createRouter();

router.use('/appellant-case-incomplete-reasons', appellantCaseIncompleteReasonsRoutes);
router.use('/appellant-case-invalid-reasons', appellantCaseInvalidReasonsRoutes);
router.use('/', appealsRoutes);

export { router as appealsRoutes };
