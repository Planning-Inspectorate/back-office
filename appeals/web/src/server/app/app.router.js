import config from '@pins/appeals.web/environment/config.js';
import { Router as createRouter } from 'express';
import { installAuthMock } from '../../../testing/app/mocks/auth.js';
import appealsRouter from '../appeals/appeals.router.js';
import applicationsRouter from '../applications/applications.router.js';
import asyncRoute from '../lib/async-route.js';
import { handleHeathCheck, viewHomepage, viewUnauthenticatedError } from './app.controller.js';
import { handleSignout } from './auth/auth.controller.js';
import { assertIsAuthenticated } from './auth/auth.guards.js';
import authRouter from './auth/auth.router.js';
import getDocumentsDownload from './components/file-downloader.component.js';
import {
	postDocumentsUpload,
	postUploadDocumentVersion
} from './components/file-uploader.component.js';

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
router.route('/documents/:caseId/upload').post(postDocumentsUpload);
router.route('/documents/:caseId/upload/:documentId/add-version').post(postUploadDocumentVersion);
router.route('/documents/:caseId/download/:guid/:preview?').get(asyncRoute(getDocumentsDownload));
router.use('/appeals-service', appealsRouter);
router.use('/applications-service', applicationsRouter);

export default router;
