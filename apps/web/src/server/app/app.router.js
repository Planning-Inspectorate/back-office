import config from '@pins/applications.web/environment/config.js';
import { Router as createRouter } from 'express';
import { installAuthMock } from '../../../testing/app/mocks/auth.js';
import applicationsRouter from '../applications/applications.router.js';

import { asyncHandler } from '@pins/express';

import {
	handleHealthCheck,
	handleAlwaysOn,
	viewHomepage,
	viewUnauthenticatedError
} from './app.controller.js';
import { handleSignout } from './auth/auth.controller.js';
import { assertGroupAccess, assertIsAuthenticated } from './auth/auth.guards.js';
import authRouter from './auth/auth.router.js';
import getDocumentsDownload from './components/file-downloader.component.js';
import {
	postDocumentsUpload,
	postUploadDocumentVersion,
	postValidateFileSignatures,
	postProcessHTMLFile
} from './components/file-uploader.component.js';
import {
	registerAdviceId,
	registerDownloadParams,
	setCustomFeaturesByCaseLocals,
	setWebEnvironmentLocals
} from './app.locals.js';
import { registerCaseId } from '../applications/create-new-case/applications-create.locals.js';
import { registerDocumentGuid } from '../applications/case/applications-case.locals.js';

const router = createRouter();

if (config.authDisabled) {
	// In development only, integrate with locally defined user groups
	router.use(installAuthMock({ groups: config.authDisabledGroupIds }));
}

// Unauthenticated routes
router.use(authRouter);
router.route('/unauthenticated').get(viewUnauthenticatedError);
router.route('/health').get(handleHealthCheck);
router.route('/').get(handleAlwaysOn);

// Authenticated routes (all other routes)

if (!config.authDisabled) {
	router.use(assertIsAuthenticated);
}

// assert membership to one of the required groups to get to any page
// this only excludes the unauthenticated routes above, such as login
// note this also works locally, as the session is mocked
//
// specific routes should still add a group access guard where required for specific RBAC
const appsConfig = config.referenceData.applications;
const groupIds = [
	appsConfig.caseAdminOfficerGroupId,
	appsConfig.caseTeamGroupId,
	appsConfig.inspectorGroupId
];
router.use(assertGroupAccess(...groupIds));

// Add web environment values to locals
router.use(setWebEnvironmentLocals);

// Add globally available local values
router.use(setCustomFeaturesByCaseLocals);

router.route('/').get(viewHomepage);
router.route('/auth/signout').get(asyncHandler(handleSignout));
router.route('/documents/:caseId/upload').post(registerCaseId, asyncHandler(postDocumentsUpload));
router
	.route('/documents/:caseId/s51-advice/:adviceId/upload')
	.post([registerCaseId, registerAdviceId], asyncHandler(postDocumentsUpload));
router
	.route('/documents/:caseId/upload/:documentId/add-version')
	.post([registerCaseId, registerDocumentGuid], asyncHandler(postUploadDocumentVersion));
router
	.route('/documents/:caseId/download/:guid/version/:version/:preview?')
	.get([registerDownloadParams], asyncHandler(getDocumentsDownload));
router.route('/documents/process-html').post(asyncHandler(postProcessHTMLFile));
router.route('/documents/validate-file-signatures').post(asyncHandler(postValidateFileSignatures));
router.use('/applications-service', applicationsRouter);

export default router;
