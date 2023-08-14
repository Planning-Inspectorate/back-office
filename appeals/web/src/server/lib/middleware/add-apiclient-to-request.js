import { createHttpLoggerHooks } from '@pins/platform';
import config from '@pins/appeals.web/environment/config.js';
import got from 'got';
import pino from '../logger.js';
import * as authSession from '../../app/auth/auth-session.service.js';

const [requestLogger, responseLogger] = createHttpLoggerHooks(pino, config.logLevelStdOut);

const instance = got.extend({
	prefixUrl: config.apiUrl,
	responseType: 'json',
	resolveBodyOnly: true
});

const getInstance = (/** @type {string} */ userId) =>
	instance.extend({
		hooks: {
			beforeRequest: [
				requestLogger,
				async (options) => {
					options.headers.azureAdUserId = userId;
				}
			],
			afterResponse: [responseLogger]
		}
	});

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object|void>}
 */
export const addApiClientToRequest = async (req, res, next) => {
	const user = authSession.getAccount(req.session);
	if (!user || !user.homeAccountId) {
		pino.info(`Unauthenticated user redirected to sign in from '${req.originalUrl}'.`);
		return res.redirect(`/auth/signin?redirect_to=${req.originalUrl}`);
	}

	pino.info(`Creating API client for user '${user.homeAccountId}'`);
	req.apiClient = getInstance(user.homeAccountId);
	next();
};
