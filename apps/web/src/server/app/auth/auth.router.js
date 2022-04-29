import express from 'express';
// import msalNode from '@azure/msal-node';
// import { authSignIn, viewAuthUnauthorized, viewAuthError, handleRedirect } from './auth.controller.js';

const router = express.Router();
// const cryptoProvider = new msalNode.CryptoProvider();

// The order here is important as the redirect needs to be handled before a new session nonce is set.
// And a nonce should be set before anythig
// router.route('/redirect').get(handleRedirect);
// router.route('/redirect').post(handleRedirect);

// TODO: This should actually be run for each main route, not just `/auth`.
// router.use((request, response, next) => {
// 	if (!request.session) {
// 		throw new Error('No session found for this request'); // TODO: Handle this gracefully (not important)
// 	}

// 	// Add session nonce for crsf
// 	request.session.nonce = cryptoProvider.createNewGuid();

// 	next();
// });

// router.route('/signin').get(authSignIn);
// router.route('/unauthorized').get(viewAuthUnauthorized);
// router.route('/error').get(viewAuthError);

export default router;
