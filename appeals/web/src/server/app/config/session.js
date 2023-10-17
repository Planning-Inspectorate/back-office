import config from '@pins/appeals.web/environment/config.js';
import session from 'express-session';
// import RedisStore from 'connect-redis';
// import { createClient } from 'redis';
// import { parseRedisConnectionString } from '@pins/platform';
// import logger from '../../lib/logger.js';

// /**
//  * @param {string} redisConnectionString
//  * @returns {import('express-session').Store}
//  */
// function createRedisStore(redisConnectionString) {
// 	if (!redisConnectionString) {
// 		throw new Error('expected redis connection string');
// 	}
// 	const details = parseRedisConnectionString(redisConnectionString);

// 	const client = createClient({
// 		socket: {
// 			host: details.host,
// 			port: details.port,
// 			tls: details.ssl
// 		},
// 		password: details.password
// 	});

// 	/** @param {Error|any} err */
// 	const onError = (err) =>
// 		logger.error(`Could not establish a connection with redis server: ${err}`);
// 	client.on('connect', () => logger.info('Initiating connection to redis server...'));
// 	client.on('ready', () => logger.info('Connected to redis server successfully...'));
// 	client.on('end', () => logger.info('Disconnected from redis server...'));
// 	client.on('error', onError);
// 	client.on('reconnecting', () => logger.info('Reconnecting to redis server...'));

// 	// kick off the connection - no await here, in the background
// 	client.connect().catch(onError);

// 	// dev note: this may 'error' in vscode, but tscheck is all OK
// 	return new RedisStore({ client });
// }

// /**
//  * @param {string} [redisConnectionString]
//  * @returns {import('express-session').Store}
//  */
// function configureStore(redisConnectionString) {
// 	if (redisConnectionString && typeof redisConnectionString === 'string') {
// 		logger.info('Configuring Redis for session storage');
// 		return createRedisStore(redisConnectionString);
// 	}
// 	// default to memory store if redis is not configured
// 	// config.session.redis is required by config schema when NODE_ENV is production
// 	// check here to be sure
// 	if (config.isProduction) {
// 		throw new Error('REDIS_CONNECTION_STRING is required in production');
// 	}
// 	logger.info('Configuring memory store for session storage');
// 	return new session.MemoryStore();
// }

// TODO: for now we want to use memory store, until Redis setup is fixed
const store = new session.MemoryStore(); // configureStore(config.session.redis);

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
