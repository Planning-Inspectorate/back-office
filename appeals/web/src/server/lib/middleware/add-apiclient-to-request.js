import { createHttpLoggerHooks } from '@pins/platform';
import config from '@pins/appeals.web/environment/config.js';
import got from 'got';
import pino from '../logger.js';
import * as authSession from '../../app/auth/auth-session.service.js';

const [requestLogger, responseLogger, retryLogger] = createHttpLoggerHooks(
	pino,
	config.logLevelStdOut
);

const instance = got.extend({
	prefixUrl: config.apiUrl,
	responseType: 'json',
	resolveBodyOnly: true
});

const getInstance = (/** @type {string} */ userId) =>
	instance.extend({
		retry: {
			limit: 3,
			statusCodes: [500, 502, 503, 504]
		},
		hooks: {
			beforeRetry: [retryLogger],
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
	if (!user || !user.localAccountId) {
		pino.error(`Unauthenticated user should not get here...`);
		return res.status(500).send('Unauthenticated user');
	}

	pino.info(`Creating API client for user '${user.localAccountId}'`);
	req.apiClient = getInstance(user.localAccountId);
	next();
};
