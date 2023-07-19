import { Router as createRouter } from 'express';
import { appealsRoutes } from './appeals/appeals.routes.js';
import { appellantCaseIncompleteReasonsRoutes } from './appellant-case-incomplete-reasons/appellant-case-incomplete-reasons.routes.js';
import { appellantCaseInvalidReasonsRoutes } from './appellant-case-invalid-reasons/appellant-case-invalid-reasons.routes.js';
import { lpaQuestionnaireIncompleteReasonsRoutes } from './lpa-questionnaire-incomplete-reasons/lpa-questionnaire-incomplete-reasons.routes.js';
import { siteVisitRoutes } from './site-visits/site-visits.routes.js';
import { appellantCasesRoutes } from './appellant-cases/appellant-cases.routes.js';
import { lpaQuestionnairesRoutes } from './lpa-questionnaires/lpa-questionnaires.routes.js';
import { documentsRoutes } from './documents/documents.routes.js';
import initNotifyClientAndAddToRequest from '../middleware/init-notify-client-and-add-to-request.js';

const router = createRouter();

router.use('/', initNotifyClientAndAddToRequest);

router.use(appellantCaseIncompleteReasonsRoutes);
router.use(appellantCaseInvalidReasonsRoutes);
router.use(appellantCasesRoutes);
router.use(documentsRoutes);
router.use(lpaQuestionnaireIncompleteReasonsRoutes);
router.use(lpaQuestionnairesRoutes);
router.use(siteVisitRoutes);
router.use(appealsRoutes);

export { router as appealsRoutes };
