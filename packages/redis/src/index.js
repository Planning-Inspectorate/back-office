import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { DistributedCachePlugin } from '@azure/msal-node';
import { parseRedisConnectionString } from '@pins/platform';
import { MSALCacheClient } from './msal-cache-client.js';
import { PartitionManager } from './partition-manager.js';

export class RedisClient {
	/**
     @param {string} connString - Redis connection string
     @param {import('./types').Logger} logger
   **/
	constructor(connString, logger) {
		this.logger = logger;

		const redisParams = parseRedisConnectionString(connString);

		this.client = createClient({
			socket: {
				host: redisParams.host,
				port: redisParams.port,
				tls: redisParams.ssl
			},
			password: redisParams.password
		});

		/** @param {Error} err */
		const onError = (err) =>
			logger.error(`Could not establish a connection with redis server: ${err}`);

		this.client.on('connect', () => logger.info('Initiating connection to redis server...'));
		this.client.on('ready', () => logger.info('Connected to redis server successfully...'));
		this.client.on('end', () => logger.info('Disconnected from redis server...'));
		this.client.on('error', onError);
		this.client.on('reconnecting', () => logger.info('Reconnecting to redis server...'));

		// kick off the connection - no await here, in the background
		this.client.connect().catch(onError);

		// dev note: this may 'error' in vscode, but tscheck is all OK
		this.store = new RedisStore({ client: this.client });

		this.get = this.client.get;
		this.set = this.client.set;

		this.clientWrapper = new MSALCacheClient(this.client);
	}

	/**
	 * @param {string} sessionId
	 * @returns {import('@azure/msal-node').DistributedCachePlugin}
	 * */
	makeCachePlugin(sessionId) {
		const partitionManager = new PartitionManager(this.clientWrapper, sessionId, this.logger);
		return new DistributedCachePlugin(
			this.clientWrapper,
			/** @type {import('@azure/msal-node').IPartitionManager} */ (partitionManager)
		);
	}
}
