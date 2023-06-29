import * as controller from '@pins/applications.web/src/server/applications/case/applications-case.controller.js';
import * as locals from '@pins/applications.web/src/server/applications/case/applications-case.locals.js';
import applicationsDocumentationRouter from '@pins/applications.web/src/server/applications/case/documentation/applications-documentation.router.js';
import applicationsDocumentationMetadataRouter from '@pins/applications.web/src/server/applications/case/documentation-metadata/documentation-metadata.router.js';
import applicationsEditRouter from '@pins/applications.web/src/server/applications/case/edit/applications-edit.router.js';
import { assertDomainTypeIsNotInspector } from '@pins/applications.web/src/server/applications/create-new-case/applications-create.guards.js';
import asyncRoute from '@pins/applications.web/src/server/lib/async-route.js';
import { Router as createRouter } from 'express';
import applicationsTimetableRouter from './examination-timetable/applications-timetable.router.js';
import relevantRepsRouter from './representations/applications-relevant-reps.router.js';
import projectUpdatesRouter from './project-updates/project-updates.router.js';

const applicationsCaseRouter = createRouter();
const applicationsCaseSummaryRouter = createRouter({ mergeParams: true });

applicationsCaseRouter.use('/:caseId/relevant-representations', relevantRepsRouter);
applicationsCaseRouter.use('/:caseId/project-updates', projectUpdatesRouter);

applicationsCaseRouter.use('/:caseId/edit', applicationsEditRouter);
applicationsCaseRouter.use(
	'/:caseId/project-documentation/:folderId/document/:documentGuid/edit',
	applicationsDocumentationMetadataRouter
);
applicationsCaseRouter.use('/:caseId/project-documentation', applicationsDocumentationRouter);
applicationsCaseRouter.use('/:caseId/examination-timetable', applicationsTimetableRouter);

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
