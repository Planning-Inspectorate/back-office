import { RedisClient } from '@pins/redis';
import config from '@pins/applications.web/environment/config.js';
import logger from './logger.js';

/**
 * @returns {RedisClient | null}
 * */
function initClient() {
  if (!config.session.redis) {
    return null;
  }

  return new RedisClient(config.session.redis, logger);
}

export default initClient();
