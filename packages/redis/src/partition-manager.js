export class PartitionManager {
	/**
	 * @param {import('@azure/msal-node').ICacheClient} redisClient
	 * @param {string} sessionId
	 * @param {import('./types').Logger} logger
	 * */
	constructor(redisClient, sessionId, logger) {
		this.redisClient = redisClient;
		this.sessionId = sessionId;
		this.logger = logger;
	}

	/**
	 * @returns {Promise<string>}
	 * */
	async getKey() {
		try {
			const sessionData = await this.redisClient.get(`sess:${this.sessionId}`);
			const session = JSON.parse(sessionData);
			return session.account?.homeAccountId || '';
		} catch (/** @type {*} */ err) {
			this.logger.error(err.msg);
			return '';
		}
	}

	/**
	 * @param {import('@azure/msal-common').AccountEntity} accountEntity
	 * @returns {Promise<string>}
	 * */
	async extractKey(accountEntity) {
		if (!accountEntity.homeAccountId) {
			throw new Error('homeAccountId not found');
		}

		return accountEntity.homeAccountId;
	}
}
