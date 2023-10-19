import config from '@pins/applications.web/environment/config.js';
import { Router as createRouter } from 'express';
import { installAuthMock } from '../../../testing/app/mocks/auth.js';
import applicationsRouter from '../applications/applications.router.js';
import asyncRoute from '../lib/async-route.js';
import { handleHeathCheck, viewHomepage, viewUnauthenticatedError } from './app.controller.js';
import { handleSignout } from './auth/auth.controller.js';
import { assertGroupAccess, assertIsAuthenticated } from './auth/auth.guards.js';
import authRouter from './auth/auth.router.js';
import getDocumentsDownload from './components/file-downloader.component.js';
import {
	postDocumentsUpload,
	postUploadDocumentVersion
} from './components/file-uploader.component.js';

const router = createRouter();

if (config.authDisabled) {
	// In development only, integrate with locally defined user groups
	router.use(installAuthMock({ groups: config.authDisabledGroupIds }));
}

// Unauthenticated routes
router.use(authRouter);
router.route('/unauthenticated').get(viewUnauthenticatedError);
router.route('/health-check').get(handleHeathCheck);

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

router.route('/').get(viewHomepage);
router.route('/auth/signout').get(asyncRoute(handleSignout));
router.route('/documents/:caseId/upload').post(postDocumentsUpload);
router.route('/documents/:caseId/s51-advice/:adviceId/upload').post(postDocumentsUpload);
router.route('/documents/:caseId/upload/:documentId/add-version').post(postUploadDocumentVersion);
router
	.route('/documents/:caseId/download/:guid/version/:version/:preview?')
	.get(asyncRoute(getDocumentsDownload));
router.use('/applications-service', applicationsRouter);

export default router;
