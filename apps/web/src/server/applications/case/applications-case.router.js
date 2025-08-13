import * as controller from '@pins/applications.web/src/server/applications/case/applications-case.controller.js';
import * as locals from '@pins/applications.web/src/server/applications/case/applications-case.locals.js';
import applicationsDocumentationRouter from '@pins/applications.web/src/server/applications/case/documentation/applications-documentation.router.js';
import applicationsDocumentationMetadataRouter from '@pins/applications.web/src/server/applications/case/documentation-metadata/documentation-metadata.router.js';
import applicationsEditRouter from '@pins/applications.web/src/server/applications/case/edit/applications-edit.router.js';
import { asyncHandler } from '@pins/express';
import { Router as createRouter } from 'express';
import { featureFlagClient } from '../../../common/feature-flags.js';
import applicationsTimetableRouter from './examination-timetable/applications-timetable.router.js';
import relevantRepsRouter from './representations/applications-relevant-reps.router.js';
import projectUpdatesRouter from './project-updates/project-updates.router.js';
import applicationsKeyDateRouter from './key-dates/applications-key-dates.router.js';
import applicationsProjectTeamRouter from './project-team/applications-project-team.router.js';
import * as validators from '../create-new-case/case/applications-create-case.validators.js';

const applicationsCaseRouter = createRouter();
const applicationsCaseSummaryRouter = createRouter({ mergeParams: true });

applicationsCaseRouter.use('/:caseId', locals.registerCase);
applicationsCaseRouter.use('/:caseId/relevant-representations', relevantRepsRouter);
applicationsCaseRouter.use('/:caseId/project-updates', projectUpdatesRouter);

applicationsCaseRouter.use('/:caseId/edit', applicationsEditRouter);
applicationsCaseRouter.use(
	'/:caseId/project-documentation/:folderId/document/:documentGuid/edit',
	applicationsDocumentationMetadataRouter
);
applicationsCaseRouter.use('/:caseId/project-documentation', applicationsDocumentationRouter);
applicationsCaseRouter.use('/:caseId/examination-timetable', applicationsTimetableRouter);
applicationsCaseRouter.use('/:caseId/key-dates', applicationsKeyDateRouter);
applicationsCaseRouter.use('/:caseId/project-team', applicationsProjectTeamRouter);

applicationsCaseRouter
	.route('/:caseId/preview-and-publish')
	.get(asyncHandler(controller.viewApplicationsCasePublishPage))
	.post(asyncHandler(controller.updateApplicationsCasePublishPage));

applicationsCaseRouter
	.route('/:caseId/unpublish')
	.get(asyncHandler(controller.viewApplicationsCaseUnpublishPage))
	.post(asyncHandler(controller.unpublishApplicationsCase));

applicationsCaseRouter.use('/:caseId', applicationsCaseSummaryRouter);

applicationsCaseSummaryRouter
	.route('/project-information')
	.get(asyncHandler(controller.viewApplicationsCaseInformation));

applicationsCaseSummaryRouter
	.route('/:overview?')
	.get(
		asyncHandler(
			/** @type {import('@pins/express').RenderHandler<{}>} */ (req, res) =>
				featureFlagClient.isFeatureActive('applic-55-welsh-translation')
					? controller.viewApplicationsCaseOverview(req, res)
					: controller.viewApplicationsCaseOverviewLegacy(req, res)
		)
	)
	.post(
		[validators.validateApplicationsCreateCaseOrganisationName],
		[validators.validateApplicationsCreateCaseNameWelsh],
		[validators.validateApplicationsCreateCaseDescriptionWelsh],
		[validators.validateApplicationsCreateCaseLocationWelsh],
		asyncHandler(controller.validateApplicationsCaseOverview)
	);

export default applicationsCaseRouter;
