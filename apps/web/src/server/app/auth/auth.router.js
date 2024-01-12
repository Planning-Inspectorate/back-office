import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { completeMsalAuthentication, startMsalAuthentication } from './auth.controller.js';
import { assertIsUnauthenticated } from './auth.guards.js';
import { clearAuthenticationData, registerAuthLocals } from './auth.pipes.js';

const router = createRouter();

router
	.route('/auth/redirect')
	.get(assertIsUnauthenticated, asyncHandler(completeMsalAuthentication));

// If the request continues beyond the MSAL redirectUri, then set the locals
// derived from the auth session and clear any pending auth data. The latter
// prevents attackers from hitting /auth/redirect in any meaningful way.
router.use(registerAuthLocals, clearAuthenticationData);

router.route('/auth/signin').get(assertIsUnauthenticated, asyncHandler(startMsalAuthentication));

export default router;
