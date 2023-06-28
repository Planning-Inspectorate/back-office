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
	.get(registerCase, asyncRoute(controller.viewApplicationsCaseTimetableList));

applicationsTimetableRouter
	.route('/item/new')
	.get(asyncRoute(controller.viewApplicationsCaseTimetableNew))
	// click on change from "check-your-answers" page
	.post(asyncRoute(controller.viewApplicationsCaseTimetableDetailsNew));

applicationsTimetableRouter
	.route('/item/edit/:timetableId')
	.get(asyncRoute(controller.viewApplicationsCaseTimetableDetailsEdit))
	// click on change from "check-your-answers" page
	.post(asyncRoute(controller.viewApplicationsCaseTimetableDetailsNew));

// click on "Continue" button from details-form
// works for edit and new
applicationsTimetableRouter
	.route('/item/validate')
	.post(
		validators.validatorsDispatcher,
		asyncRoute(controller.postApplicationsCaseTimetableDetails)
	);

// redirect to check-your-answers page
// triggered by Validate controller: no button leads directly here
// works for edit and new
applicationsTimetableRouter
	.route('/item/check-your-answers/:timetableId?')
	.post(asyncRoute(controller.postApplicationsCaseTimetableCheckYourAnswers));

// click on "Save" from "check-your-answers" page
// works for edit and new
applicationsTimetableRouter
	.route('/item/save')
	.post(asyncRoute(controller.postApplicationsCaseTimetableSave));

applicationsTimetableRouter
	.route('/preview')
	.get(asyncRoute(controller.viewApplicationsCaseTimetablesPreview))
	.post(asyncRoute(controller.publishApplicationsCaseTimetables));

applicationsTimetableRouter
	.route('/item/delete/:timetableId')
	.get(asyncRoute(controller.viewApplicationsCaseTimetableDelete))
	.post(asyncRoute(controller.deleteApplicationsCaseTimetable));

applicationsTimetableRouter
	.route('/:action/success')
	.get(registerCase, asyncRoute(controller.viewApplicationsCaseTimetableSuccessBanner));

export default applicationsTimetableRouter;
