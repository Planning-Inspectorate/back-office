import msal, { LogLevel } from '@azure/msal-node';
import config from '#environment/config.js';
import pino from './logger.js';
import redisClient from './redis.js';

const msalConfig = {
	auth: {
		clientId: config.msal.clientId,
		authority: config.msal.authority,
		clientSecret: config.msal.clientSecret
	},
	system: {
		loggerOptions: {
			/**
			 * @param {LogLevel} logLevel
			 * @param {string} message
			 * */
			loggerCallback(logLevel, message) {
				switch (logLevel) {
					case LogLevel.Error:
						pino.error(message);
						break;

					case LogLevel.Warning:
						pino.warn(message);
						break;

					case LogLevel.Info:
						pino.info(message);
						break;

					case LogLevel.Verbose:
						pino.debug(message);
						break;

					default:
						pino.trace(message);
				}
			},
			piiLoggingEnabled: false,
			logLevel: msal.LogLevel.Warning
		}
	}
};

/** @type {msal.ConfidentialClientApplication | null} */
let msalClient = null;

/**
 * If not using Redis, behave as a singleton and return the one global MSAL client.
 * If using Redis, generate an MSAL client specific to the user's session ID.
 *
 * @param {string} sessionId
 * @returns {msal.ConfidentialClientApplication}
 * */
export const getMsalClient = (sessionId) => {
	if (redisClient) {
		return new msal.ConfidentialClientApplication({
			...msalConfig,
			cache: { cachePlugin: redisClient.makeCachePlugin(sessionId) }
		});
	}

	if (!msalClient) {
		msalClient = new msal.ConfidentialClientApplication(msalConfig);
	}

	return msalClient;
};

/**
 * Set the MSAL redirectUri as an absolute url if it exists only as a path.
 * Unless provided as an absolute url in the .env file, this can only be done at
 * runtime once the protocol and host is known.
 *
 * @type {import('express').RequestHandler}
 */
export const msalMiddleware = (req, _, next) => {
	config.msal.redirectUri = `${req.protocol}://${config.appHostname}${config.authRedirectPath}`;
	next();
};
