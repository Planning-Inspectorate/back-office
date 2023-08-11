import config from '#environment/config.js';
import { assertGroupAccess } from './auth/auth.guards.js';
import { Router as createRouter } from 'express';
import { installAuthMock } from '#testing/app/mocks/auth.js';
import appealsRouter from '../appeals/appeals.router.js';
import asyncRoute from '../lib/async-route.js';
import { handleHeathCheck, viewHomepage, viewUnauthenticatedError } from './app.controller.js';
import { handleSignout } from './auth/auth.controller.js';
import { assertIsAuthenticated } from './auth/auth.guards.js';
import getDocumentDownload from './components/file-downloader.component.js';
import {
	postDocumentsUpload,
	postUploadDocumentVersion
} from './components/file-uploader.component.js';
import { addApiClientToRequest } from '../lib/middleware/add-apiclient-to-request.js';
import authRouter from './auth/auth.router.js';

const router = createRouter();

// In development only, integrate with locally defined user groups

if (config.authDisabled) {
	router.use(installAuthMock({ groups: config.authDisabledGroupIds }));
}

router.use(authRouter);

// Unauthenticated routes

router.route('/unauthenticated').get(viewUnauthenticatedError);
router.route('/health-check').get(handleHeathCheck);

// Authenticated routes

if (!config.authDisabled) {
	router.use(assertIsAuthenticated);
}

router.route('/').get(viewHomepage);
router.route('/auth/signout').get(asyncRoute(handleSignout));

router
	.route('/documents/:caseId/upload')
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		addApiClientToRequest,
		postDocumentsUpload
	);
router
	.route('/documents/:caseId/upload/:documentId')
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		addApiClientToRequest,
		postUploadDocumentVersion
	);

router.route('/documents/:caseId/download/:guid/:preview?').get(asyncRoute(getDocumentDownload));
router.use('/appeals-service', addApiClientToRequest, appealsRouter);

export default router;
