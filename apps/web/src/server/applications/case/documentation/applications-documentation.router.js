import { assertDomainTypeIsNotInspector } from '@pins/web/src/server/applications/create-new-case/applications-create.guards.js';
import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as locals from '../applications-case.locals.js';
import * as controller from './applications-documentation.controller.js';
import {
	validateApplicationsDocumentations,
	validateApplicationsDocumentationsDeleteStatus
} from './applications-documentation.validators.js';

const applicationsDocumentationRouter = createRouter({ mergeParams: true });

// TODO: make sure this is used only by the routes that require it
applicationsDocumentationRouter.use(locals.registerCase);

applicationsDocumentationRouter
	.route('/')
	.get(asyncRoute(controller.viewApplicationsCaseDocumentationCategories));

applicationsDocumentationRouter
	.route('/publishing-queue')
	.get(
		[assertDomainTypeIsNotInspector],
		asyncRoute(controller.viewApplicationsCaseDocumentationPublishingQueue)
	);

import * as express from 'express';
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 * @returns {*}
 */
function relevantRepsMiddleware(req, res, next) {
	if (req.params.folderName === 'relevant-representations') {
		return res.redirect(`/applications-service/case/${req.params.caseId}/relevant-representations`);
	}
	next();
}

applicationsDocumentationRouter
	.route('/:folderId/:folderName')
	.get(
		relevantRepsMiddleware,
		locals.registerFolder,
		asyncRoute(controller.viewApplicationsCaseDocumentationFolder)
	)
	.post(
		[validateApplicationsDocumentations, locals.registerFolder],
		asyncRoute(controller.updateApplicationsCaseDocumentationFolder)
	);

applicationsDocumentationRouter
	.route('/:folderId/:folders/upload')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationUpload)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/remove-from-publishing-queue')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.removeApplicationsCaseDocumentationPublishingQueue)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/:action')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationPages)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/delete')
	.post(
		[
			assertDomainTypeIsNotInspector,
			locals.registerFolder,
			validateApplicationsDocumentationsDeleteStatus
		],
		asyncRoute(controller.updateApplicationsCaseDocumentationDelete)
	);

export default applicationsDocumentationRouter;
