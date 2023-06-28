import { Router as createRouter } from 'express';
import { appealsRoutes } from './appeals/appeals.routes.js';
import { documentsRoutes } from '../documents/documents.routes.js';
import { appellantCaseIncompleteReasonsRoutes } from './appellant-case-incomplete-reasons/appellant-case-incomplete-reasons.routes.js';
import { appellantCaseInvalidReasonsRoutes } from './appellant-case-invalid-reasons/appellant-case-invalid-reasons.routes.js';
import { lpaQuestionnaireIncompleteReasonsRoutes } from './lpa-questionnaire-incomplete-reasons/lpa-questionnaire-incomplete-reasons.routes.js';

const router = createRouter();

router.use('/appellant-case-incomplete-reasons', appellantCaseIncompleteReasonsRoutes);
router.use('/appellant-case-invalid-reasons', appellantCaseInvalidReasonsRoutes);
router.use('/lpa-questionnaire-incomplete-reasons', lpaQuestionnaireIncompleteReasonsRoutes);
router.use('/documents', documentsRoutes);
router.use('/', appealsRoutes);

export { router as appealsRoutes };
