import { init, get, set } from 'node-cache-redis';
import { parseRedisConnectionString } from '@pins/platform';
import logger from './logger.js';

/**
 * @param {string} connString
 * */
export function initialiseRedis(connString) {
	logger.info('Initialising Redis...');

	const details = parseRedisConnectionString(connString);

	init({
		name: 'auth-cache',
		redisOptions: {
			url: `redis://:${details.password}@${details.host}:${details.port}/0`
		}
	});
}

export { get, set };
