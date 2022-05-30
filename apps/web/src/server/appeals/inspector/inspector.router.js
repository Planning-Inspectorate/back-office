import { Router as createRouter } from 'express';
import * as controller from './inspector.controller.js';
import * as guards from './inspector.guards.js';
import * as locals from './inspector.locals.js';
import * as validators from './inspector.validators.js';

const router = createRouter();

router.use(locals.registerInspectorLocals);
router.route('/').get(controller.viewDashboard);

router
	.route('/available-appeals')
	.get(controller.viewAvailableAppeals)
	.post(validators.validateAvailableAppeals, controller.assignAvailableAppeals);

router.param('appealId', locals.loadAppeal);
router.route('/appeals/:appealId').get(controller.viewAppealDetails);

router
	.route('/appeals/:appealId/book-site-visit')
	.all(guards.assertCanBookSiteVisit)
	.get(controller.newSiteVisit)
	.post(validators.validateBookSiteVisit, controller.createSiteVisit);

router
	.route('/appeals/:appealId/confirm-site-visit')
	.all(guards.assertSiteVisitInSession, guards.assertCanBookSiteVisit)
	.get(controller.viewSiteVisitConfirmation)
	.post(controller.confirmSiteVisit);

router
	.route('/appeals/:appealId/issue-decision')
	.all(guards.assertCanIssueDecision)
	.get(controller.newDecision)
	.post(validators.validateIssueDecision, controller.createDecision);

router
	.route('/appeals/:appealId/confirm-decision')
	.all(guards.assertDecisionInSession, guards.assertCanIssueDecision)
	.get(controller.viewDecisionConfirmation)
	.post(controller.confirmDecision);

router
	.route('/appeals/:appealId/confirm-decision/download-decision-letter')
	.get(controller.downloadDecisionLetter);

export default router;
