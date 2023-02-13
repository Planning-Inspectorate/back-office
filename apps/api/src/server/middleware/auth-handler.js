import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import config from '../config/config.js';
import BackOfficeAppError from '../utils/app-error.js';
import logger from '../utils/logger.js';

const DISCOVERY_KEYS_ENDPOINT = `${config.msal.authority}/discovery/v2.0/keys`;

/**
 * Initializes and returns an instance of the jwksClient library with the given options.
 *
 * @typedef {object} jwksClientOptions
 * @property {boolean} cache - A flag indicating whether to cache the JSON Web Key Set (JWKS) retrieved from the jwksUri endpoint.
 * @property {boolean} rateLimit - A flag indicating whether to limit the rate at which the JWKS endpoint is accessed.
 * @property {string} jwksUri - The URI of the JWKS endpoint that provides the public keys needed to validate JSON Web Tokens (JWTs).
 * @param {jwksClientOptions} options - An object containing the options for the jwksClient instance.
 * @returns {object} An instance of the jwksClient library.
 */
const client = jwksClient({
	cache: true,
	rateLimit: true,
	jwksUri: DISCOVERY_KEYS_ENDPOINT
});

/**
 * Options for verifying JSON Web Tokens (JWTs).
 *
 * @typedef {object} jwtVerifyOptions
 * @property {string[]} audience - An array of valid audience (aud) claims in the JWT.
 * @property {string[]} issuer - An array of valid issuer (iss) claims in the JWT.
 * @property {string[]} algorithms - An array of valid signing algorithms used in the JWT.
 */
const jwtOptions = {
	audience: [`api://${config.msal.clientId}`],
	issuer: [`https://sts.windows.net/${config.msal.tenantId}/`],
	algorithms: ['RS256']
};

/**
 * Decodes an access token using JSON Web Token (JWT) decoding.
 *
 * @function
 * @param {string} accessToken - The access token to be decoded
 * @returns {Promise<jwt.Jwt>} The decoded access token as a JSON object.
 */
const decodeClientAccessToken = async (accessToken) => {
	logger.info('attempting to decode access token');

	const decoded = await jwt.decode(accessToken, { complete: true });

	if (!decoded || !decoded.header || !decoded.header.kid) {
		throw new BackOfficeAppError('invalid access token', 401);
	}

	logger.info('successfully decoded access token');

	return decoded;
};

/**
 * @param {string} accessToken - The access token to be verified
 * @param {jwt.Jwt} decoded - The decoded JWT token object
 * @throws {Error} If the signing key cannot be retrieved or if the access token is invalid
 *@returns {Promise<jwt.Jwt>}
 */
async function verifyClientAccessToken(accessToken, decoded) {
	logger.info('attempting to sign and retrieve public key');

	const key = await client.getSigningKey(decoded.header.kid);

	const signingKey = key.getPublicKey();

	logger.info('successfully retrieved public key');
	logger.info('attempting to verify access token from client');

	// @ts-ignore
	return jwt.verify(accessToken, signingKey, jwtOptions);
}

/**
 * A middleware function that performs client authorization.
 * It validates the access token sent in the request header
 * and ensures that the client is authorized to access the requested resource.
 *
 * @type {import('express').Handler}
 * @throws {Error} If the access token is not present in the request header,
 * if the access token is invalid, or if the client is not authorized.
 * The error message is sent in the response body with a status code of 401.
 */
export async function authorizeClientMiddleware(req, response, next) {
	const errorMessage = 'You have no access! Please try again later.';

	if (config.clientCredentialsGrantEnabled) {
		try {
			// 1) Getting token and check of it's there
			const accessToken = req.headers.authorization?.split(' ')[1];

			if (!accessToken) {
				logger.error(`Access token not present in request header`);
				throw new BackOfficeAppError(errorMessage, 401);
			}

			const decoded = await decodeClientAccessToken(accessToken);
			const payload = await verifyClientAccessToken(accessToken, decoded);

			logger.info('successfully verified access token', payload);

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
