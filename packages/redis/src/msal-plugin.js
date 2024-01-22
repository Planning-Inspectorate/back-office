export class MSALPlugin {
	/**
	 * @param {import('@azure/msal-node').ICacheClient} client
	 * @param {import('./types').Logger} logger
	 * */
	constructor(client, logger) {
		this.client = client;
		this.logger = logger;
	}

	/**
	 * @param {import('@azure/msal-node').TokenCacheContext} cacheContext
	 * */
	async beforeCacheAccess(cacheContext) {
		if (!this.client) {
			this.logger.error('Tried to access uninitialised Redis cache.');
			return;
		}

		const cacheData = await this.client.get('msal');
		if (!cacheData) {
			return;
		}

		cacheContext.tokenCache.deserialize(cacheData);
	}

	/**
	 * @param {import('@azure/msal-node').TokenCacheContext} cacheContext
	 * */
	async afterCacheAccess(cacheContext) {
		if (!this.client) {
			this.logger.error('Tried to access uninitialised Redis cache.');
			return;
		}

		if (cacheContext.cacheHasChanged) {
			await this.client.set('msal', cacheContext.tokenCache.serialize());
		}
	}
}

export class MSALCacheClient {
	/**
	 * @param {ReturnType<import('redis').createClient>} redisClient
	 * */
	constructor(redisClient) {
		this.redisClient = redisClient;
	}

	/**
	 * @param {string} key
	 * @returns {Promise<string>}
	 * */
	async get(key) {
		return (await this.redisClient.get(key)) ?? '';
	}

	/**
	 * @param {string} key
	 * @param {string} value
	 * @returns {Promise<string>}
	 * */
	async set(key, value) {
		return (await this.redisClient.set(key, value)) ?? '';
	}
}
