import { registerCase } from '@pins/web/src/server/applications/case/applications-case.locals.js';
import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import { assertDomainTypeIsNotInspector } from '../../create-new-case/applications-create.guards.js';
import { registerCaseId } from '../../create-new-case/applications-create.locals.js';
import * as controller from './applications-timetable.controller.js';
import * as validators from './applications-timetable.validators.js';

const applicationsTimetableRouter = createRouter({ mergeParams: true });

applicationsTimetableRouter.use(assertDomainTypeIsNotInspector, registerCaseId);
applicationsTimetableRouter
	.route('/')
	.get([registerCase], asyncRoute(controller.viewApplicationsCaseExaminationTimeTable));

applicationsTimetableRouter
	.route('/new-item')
	.get(asyncRoute(controller.viewApplicationsCaseTimetableNew))
	.post(asyncRoute(controller.postApplicationsCaseTimetableNew));

applicationsTimetableRouter
	.route('/new-item/validate')
	.post(
		validators.validatorsDispatcher,
		asyncRoute(controller.postApplicationsCaseTimetableDetails)
	);

applicationsTimetableRouter
	.route('/new-item/check-your-answers')
	.post(asyncRoute(controller.postApplicationsCaseTimetableCheckYourAnswers));

applicationsTimetableRouter
	.route('/new-item/save')
	.post(asyncRoute(controller.postApplicationsCaseTimetableSave));

applicationsTimetableRouter
	.route('/new-item/success')
	.get(registerCase, asyncRoute(controller.showApplicationsCaseTimetableSuccessBanner));

applicationsTimetableRouter
	.route('/preview')
	.get(asyncRoute(controller.previewApplicationsCaseExaminationTimeTable));

applicationsTimetableRouter
	.route('/publish')
	.post(asyncRoute(controller.publishApplicationsCaseExaminationTimeTable));

applicationsTimetableRouter
	.route('/publish/success')
	.get(registerCase, asyncRoute(controller.showApplicationsCaseTimetablePublishSuccessBanner));

export default applicationsTimetableRouter;
