import { init, get, set } from 'node-cache-redis';
import config from '@pins/applications.web/environment/config.js';
import { parseRedisConnectionString } from '@pins/platform';

const details = parseRedisConnectionString(config.session.redis);

init({
	name: 'auth-cache',
	redisOptions: {
		url: `redis://:${details.password}@${details.host}:${details.port}/0`
	}
});

export { get, set };
