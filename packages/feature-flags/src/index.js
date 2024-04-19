/**
 * @typedef {Function} Logger
 * @param {...string} args
 * @returns {void}
 * */

/**
 * @param {{ debug: Logger, error: Logger }} logger
 * @param {string} [connectionString]
 * @returns {(featureFlagName: string) => Promise<boolean>}
 * */
export const isFeatureActive = (logger, connectionString) => {
	if (process.env.FEATURE_FLAGS_SETTING === 'ALL_ON') {
		return async () => true;
	}

	if (connectionString === undefined) {
		logger.debug('Returning false for all feature flags because no connection string provided.');
		return async () => false;
	}

	if (connectionString.length <= 1) {
		logger.error(`Connection string is invalid.`);
		return async () => false;
	}

	const { AppConfigurationClient } = require('@azure/app-configuration');
	const appConfigClient = new AppConfigurationClient(connectionString);

	return async (featureFlagName) => {
		const flagName = featureFlagName.trim();
		logger.debug(`Retrieving configuration for feature flag with name '${flagName}'`);
		if (!flagName) {
			logger.error('A feature flag key must be supplied.');
			return false;
		}

		const flagConfiguration = await (async () => {
			try {
				return await appConfigClient.getConfigurationSetting({
					key: `.appconfig.featureflag/${flagName}`
				});
			} catch (err) {
				logger.error(err);
				throw err;
			}
		})();

		if (!(flagConfiguration && typeof flagConfiguration === 'object' && flagConfiguration.value)) {
			logger.debug(`Retrieved invalid feature flag configuration; retrieved value follows...`);
			logger.debug(flagConfiguration);
			return false;
		}

		const flagValue = JSON.parse(flagConfiguration.value);

		logger.debug(`Feature flag: ${flagValue.id} ${flagValue.enabled}`);

		return flagValue.enabled;
	};
};
