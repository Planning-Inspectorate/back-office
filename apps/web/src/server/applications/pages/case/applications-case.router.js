import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-case.controller.js';
import * as locals from './applications-case.locals.js';
import applicationsDocumentationRouter from './documentation/applications-documentation.router.js';
import applicationsEditRouter from './edit/applications-edit.router.js';

const applicationsCaseRouter = createRouter();
const applicationsCaseSummaryRouter = createRouter({ mergeParams: true });

applicationsCaseRouter.use('/:caseId/edit', applicationsEditRouter);
applicationsCaseRouter.use('/:caseId/project-documentation', applicationsDocumentationRouter);

applicationsCaseRouter.use('/:caseId', applicationsCaseSummaryRouter);

applicationsCaseSummaryRouter.use(locals.registerCase);
applicationsCaseSummaryRouter
	.route('/:pageType?')
	.get(asyncRoute(controller.viewApplicationsCasePages));
applicationsCaseSummaryRouter
	.route('/preview-and-publish')
	.post(asyncRoute(controller.updateApplicationsCasePublishPage));

export default applicationsCaseRouter;
