import config from '@pins/web/environment/config.js';
import { Router as createRouter } from 'express';
import { installAuthMock } from '../../../testing/app/mocks/auth.js';
import appealsRouter from '../appeals/appeals.router.js';
import applicationsRouter from '../applications/applications.router.js';
import pino from '../lib/logger.js';
import { handleHeathCheck, viewHomepage, viewUnauthenticatedError } from './app.controller.js';
import { handleSignout } from './auth/auth.controller.js';
import { assertIsAuthenticated } from './auth/auth.guards.js';
import authRouter from './auth/auth.router.js';
import * as authSession from './auth/auth-session.service.js';

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

// TODO: remove this
router.route('/auth/session-token').get((/** @type {*} */ request, /** @type {*} */ response) => {
	const account = authSession.getAccount(request.session);

	pino.info(`[WEB] account session token from controller: ${account?.accessToken}`);

	response.send(account ?? 'NO ACCESS TOKEN');
});

router.route('/').get(viewHomepage);
router.route('/auth/signout').get(handleSignout);
router.use('/appeals-service', appealsRouter);
router.use('/applications-service', applicationsRouter);

export default router;
