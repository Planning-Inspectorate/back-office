import { Router as createRouter } from 'express';
import { appealsRoutes } from './appeals/appeals.routes.js';
import { appellantCaseIncompleteReasonsRoutes } from './appellant-case-incomplete-reasons/appellant-case-incomplete-reasons.routes.js';
import { appellantCaseInvalidReasonsRoutes } from './appellant-case-invalid-reasons/appellant-case-invalid-reasons.routes.js';
import { lpaQuestionnaireIncompleteReasonsRoutes } from './lpa-questionnaire-incomplete-reasons/lpa-questionnaire-incomplete-reasons.routes.js';
import { siteVisitRoutes } from './site-visit/site-visit.routes.js';
import initNotifyClientAndAddToRequest from '../middleware/init-notify-client-and-add-to-request.js';

const router = createRouter();

router.use('/', initNotifyClientAndAddToRequest);
router.use('/appellant-case-incomplete-reasons', appellantCaseIncompleteReasonsRoutes);
router.use('/appellant-case-invalid-reasons', appellantCaseInvalidReasonsRoutes);
router.use('/lpa-questionnaire-incomplete-reasons', lpaQuestionnaireIncompleteReasonsRoutes);
router.use(siteVisitRoutes);
router.use('/', appealsRoutes);

export { router as appealsRoutes };
