import * as locals from '@pins/web/src/server/applications/case/applications-case.locals.js';
import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import { assertDomainTypeIsNotInspector } from '../../create-new-case/applications-create.guards.js';
import { registerCaseId } from '../../create-new-case/applications-create.locals.js';
import * as controller from './applications-timetable.controller.js';

const applicationsTimetableRouter = createRouter({ mergeParams: true });

applicationsTimetableRouter.use(assertDomainTypeIsNotInspector, registerCaseId);
applicationsTimetableRouter
	.route('/')
	.get([locals.registerCase], asyncRoute(controller.viewApplicationsCaseExaminationTimeTable));

applicationsTimetableRouter
	.route('/new-item')
	.get(asyncRoute(controller.viewApplicationsCaseTimetableNew))
	.post(asyncRoute(controller.postApplicationsCaseTimetableNew));

export default applicationsTimetableRouter;
