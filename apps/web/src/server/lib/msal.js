import msal, { LogLevel } from '@azure/msal-node';
import config from '@pins/applications.web/environment/config.js';
import pino from './logger.js';
import * as redis from './redis.js';

/**
 * @param {*} cacheContext
 * */
const beforeCacheAccess = async (cacheContext) => {
	const cacheData = await redis.get('msal');
	cacheContext.tokenCache.deserialize(cacheData);
};

/**
 * @param {*} cacheContext
 * */
const afterCacheAccess = async (cacheContext) => {
	if (cacheContext.cacheHasChanged) {
		await redis.set('msal', cacheContext.tokenCache.serialize());
	}
};

const cachePlugin = {
	beforeCacheAccess,
	afterCacheAccess
};

export const msalClient = new msal.ConfidentialClientApplication({
	auth: {
		clientId: config.msal.clientId,
		authority: config.msal.authority,
		clientSecret: config.msal.clientSecret
	},
	system: {
		loggerOptions: {
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
	},
	cache: { cachePlugin }
});

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
