import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import config from '../config/config.js';
import logger from '../utils/logger.js';

const DISCOVERY_KEYS_ENDPOINT = `${config.msal.authority}/discovery/v2.0/keys`;

const client = jwksClient({
	cache: true,
	rateLimit: true,
	jwksUri: DISCOVERY_KEYS_ENDPOINT
});

const jwtOptions = {
	audience: [`api://${config.msal.clientId}`],
	issuer: [`https://sts.windows.net/${config.msal.tenantId}/`],
	algorithms: ['RS256']
};

/**
 * getDecodedAccessToken
 *
 * @param {string} accessToken
 *  @returns {jwt.Jwt | null} date two weeks ago
 */
const getDecodedAccessToken = (accessToken) => {
	return jwt.decode(accessToken, { complete: true });
};

/**
 * The auth handler.
 *
 * @type {import('express').Handler}
 */
export async function validateClientHandler(req, response, next) {
	// 1) Getting token and check of it's there
	let accessToken;

	const errorMessage = 'You have no access! Please try again later.';

	if (config.clientCredentialsGrantEnabled) {
		try {
			if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
				accessToken = req.headers.authorization.split(' ')[1];
			}

			if (!accessToken) {
				throw new Error(errorMessage);
			}

			logger.info('attempting to decode access token');

			const decoded = getDecodedAccessToken(accessToken);

			logger.info('successfully decoded access token');

			if (!decoded || !decoded.header || !decoded.header.kid) {
				throw new Error('invalid access token');
			}

			logger.info('attempting to sign and retrieve public key');

			const key = await client.getSigningKey(decoded.header.kid);

			const signingKey = key.getPublicKey();

			logger.info('successfully retrieved public key');

			logger.info('attempting to verify access token from client');

			// @ts-ignore
			jwt.verify(accessToken, signingKey, jwtOptions);

			logger.info('successfully verified access token');

			next();
		} catch (error) {
			logger.error(error);

			// @ts-ignore
			response.status(401).send({ errors: [{ message: error?.message || errorMessage }] });
		}
	} else {
		next();
	}
}
