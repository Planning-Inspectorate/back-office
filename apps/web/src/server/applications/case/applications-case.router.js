import * as controller from '@pins/web/src/server/applications/case/applications-case.controller.js';
import * as locals from '@pins/web/src/server/applications/case/applications-case.locals.js';
import applicationsDocumentationRouter from '@pins/web/src/server/applications/case/documentation/applications-documentation.router.js';
import applicationsDocumentationMetadataRouter from '@pins/web/src/server/applications/case/documentation-metadata/documentation-metadata.router.js';
import applicationsEditRouter from '@pins/web/src/server/applications/case/edit/applications-edit.router.js';
import { assertDomainTypeIsNotInspector } from '@pins/web/src/server/applications/create-new-case/applications-create.guards.js';
import asyncRoute from '@pins/web/src/server/lib/async-route.js';
import { Router as createRouter } from 'express';

const applicationsCaseRouter = createRouter();
const applicationsCaseSummaryRouter = createRouter({ mergeParams: true });

applicationsCaseRouter.use('/:caseId/edit', applicationsEditRouter);
applicationsCaseRouter.use(
	'/:caseId/project-documentation/:caseId/document/:documentGuid/edit',
	applicationsDocumentationMetadataRouter
);
applicationsCaseRouter.use('/:caseId/project-documentation', applicationsDocumentationRouter);

applicationsCaseRouter
	.route('/:caseId/preview-and-publish')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerCase],
		asyncRoute(controller.viewApplicationsCasePublishPage)
	)
	.post(
		[assertDomainTypeIsNotInspector, locals.registerCase],
		asyncRoute(controller.updateApplicationsCasePublishPage)
	);

applicationsCaseRouter.use('/:caseId/:pageType?', applicationsCaseSummaryRouter);

applicationsCaseSummaryRouter.use(locals.registerCase);
applicationsCaseSummaryRouter.route('/').get(asyncRoute(controller.viewApplicationsCasePages));

export default applicationsCaseRouter;
