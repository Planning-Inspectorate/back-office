/**
 * @param {ReturnType<import('redis').createClient>} client
 * @param {import('./types').Logger} logger
 * @returns {import('./types').MSALCachePlugin}
 * */
export const createMsalPlugin = (client, logger) => ({
	async beforeCacheAccess(cacheContext) {
		if (!client) {
			logger.error('Tried to access uninitialised Redis cache.');
			return;
		}

		const cacheData = await client.get('msal');
		if (!cacheData) {
			return;
		}

		cacheContext.tokenCache.deserialize(cacheData);
	},

	async afterCacheAccess(cacheContext) {
		if (!client) {
			logger.error('Tried to access uninitialised Redis cache.');
			return;
		}

    if (cacheContext.cacheHasChanged) {
      await client.set('msal', cacheContext.tokenCache.serialize());
    }
  }
});
