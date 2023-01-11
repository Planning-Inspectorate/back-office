import config from '@pins/web/environment/config.js';
import { Router as createRouter } from 'express';
import { installAuthMock } from '../../../testing/app/mocks/auth.js';
import appealsRouter from '../appeals/appeals.router.js';
import applicationsRouter from '../applications/applications.router.js';
import { handleHeathCheck, viewHomepage, viewUnauthenticatedError } from './app.controller.js';
import { handleSignout } from './auth/auth.controller.js';
import { assertIsAuthenticated } from './auth/auth.guards.js';
import authRouter from './auth/auth.router.js';
import getDocumentsDownload from './components/file-downloader.component.js';
import { postDocumentsUpload } from './components/file-uploader.component.js';

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
router.route('/auth/signout').get(handleSignout);
router.route('/documents/:caseId/upload').post(postDocumentsUpload);
router.route('/documents/:guid/download/:preview?').get(getDocumentsDownload);
router.use('/appeals-service', appealsRouter);
router.use('/applications-service', applicationsRouter);

export default router;
