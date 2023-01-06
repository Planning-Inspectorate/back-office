import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-case.controller.js';
import * as locals from './applications-case.locals.js';
import applicationsDocumentationRouter from './documentation/applications-documentation.router.js';
import applicationsEditRouter from './edit/applications-edit.router.js';

const applicationsCaseRouter = createRouter();
const applicationsCaseSummaryRouter = createRouter({ mergeParams: true });

applicationsCaseRouter.use('/:caseId/edit', applicationsEditRouter);
applicationsCaseRouter.use(
	'/:caseId/publish',
	locals.registerCase,
	asyncRoute(controller.viewApplicationsCasePublishPage)
);
applicationsCaseRouter.use('/:caseId/project-documentation', applicationsDocumentationRouter);

applicationsCaseRouter.use('/:caseId/:pageType?', applicationsCaseSummaryRouter);

applicationsCaseSummaryRouter.use(locals.registerCase);
applicationsCaseSummaryRouter.route('/').get(asyncRoute(controller.viewApplicationsCasePages));

export default applicationsCaseRouter;
