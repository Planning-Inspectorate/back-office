import config from '@pins/applications.web/environment/config.js';
import session from 'express-session';
import logger from '../../lib/logger.js';
import redisClient from '../../lib/redis.js';

/**
 * @returns {import('express-session').Store}
 */
function configureStore() {
	if (!redisClient) {
		if (config.isProduction) {
			throw new Error('REDIS_CONNECTION_STRING is required in production.');
		} else if (config.env !== 'local') {
			logger.warn(
				'REDIS_CONNECTION_STRING was not provided. Using express-session instead of Redis.'
			);
		}

		logger.info('Configuring memory store for session storage');
		return new session.MemoryStore();
	}

	logger.info('Configuring Redis for session storage');
	return redisClient.store;
}

const store = configureStore();

export default session({
	secret: config.session?.secret,
	resave: false,
	saveUninitialized: false,
	store,
	unset: 'destroy',
	cookie: {
		secure: config.isProduction,
		maxAge: 86_400_000
	}
});
