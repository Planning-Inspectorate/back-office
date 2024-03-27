import config from '@pins/applications.web/environment/config.js';
import session from 'express-session';
import logger from '../../lib/logger.js';
import redisClient from '../../lib/redis.js';

/**
 * @returns {import('express-session').Store}
 */
function configureStore() {
	if (redisClient) {
		logger.info('Configuring Redis for session storage');
		return redisClient.store;
	}

	if (!(config.env === 'local' || config.disableRedis)) {
		throw new Error('Redis is required but failed to initialise.');
	}

	logger.info('Configuring memory store for session storage');
	return new session.MemoryStore();
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
		maxAge: 28_800_000
	}
});
