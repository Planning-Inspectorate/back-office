import msalNode from '@azure/msal-node';
import { Router as createRouter } from 'express';
import {
	authSignIn,
	handleRedirect,
	viewAuthError,
	viewAuthUnauthorized
} from './auth.controller.js';

const router = createRouter();
const cryptoProvider = new msalNode.CryptoProvider();

// The order here is important as the redirect needs to be handled before a new session nonce is set.
// And a nonce should be set before anythig
router.route('/redirect').get(handleRedirect);
router.route('/redirect').post(handleRedirect);

// TODO: This should actually be run for each main route, not just `/auth`.
router.use((request, response, next) => {
	if (!request.session) {
		// TODO: Handle this gracefully (not important)
		throw new Error('No session found for this request');
	}

	// Add session nonce for crsf
	request.session.nonce = cryptoProvider.createNewGuid();

	next();
});

router.route('/signin').get(authSignIn);
router.route('/unauthorized').get(viewAuthUnauthorized);
router.route('/error').get(viewAuthError);

export default router;
