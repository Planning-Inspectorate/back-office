import { Router as createRouter } from 'express';
import {
	completeMsalAuthentication,
	handleSignout,
	startMsalAuthentication
} from './auth.controller.js';
import { assertIsUnauthenticated } from './auth.guards.js';
import { clearAuthenticationData, registerAuthLocals } from './auth.pipes.js';

const router = createRouter();

router.route('/auth/redirect').get(assertIsUnauthenticated, completeMsalAuthentication);

// If the request continues beyond the MSAL redirectUri, then set the locals
// derived from the auth session and clear any pending auth data. The latter
// prevents attackers from hitting /auth/redirect in any meaningful way.
router.use(registerAuthLocals, clearAuthenticationData);

router.route('/auth/signin').get(assertIsUnauthenticated, startMsalAuthentication);

// This route does not require authentication as it's registered as the Frontend
// Logout Url with MSAL and could be called even if the user is not logged into
// the back office. Internally, however, we just do nothing if the user is not
// signed in.
router.route('/auth/signout').get(handleSignout);

export default router;
