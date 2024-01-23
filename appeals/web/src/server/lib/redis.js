import { RedisClient } from '@pins/redis';
import config from '#environment/config.js';
import logger from './logger.js';

/**
 * @returns {RedisClient | null}
 * */
function initClient() {
	if (!config.session.redis || config.disableRedis) {
		return null;
	}

	return new RedisClient(config.session.redis, logger);
}

export default initClient();
