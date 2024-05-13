import getStaticFlags from './get-static-flags.js';

/**
 * @typedef {(featureFlagName: string) => Promise<boolean>} IsFeatureActiveFn
 * */

/**
 * @param {import('./feature-flag-client.js').Logger} logger
 * @param {import('@azure/app-configuration').AppConfigurationClient} [client]
 * @returns {IsFeatureActiveFn}
 * */
export const makeIsFeatureActive = (logger, client) => {
	if (process.env.STATIC_FEATURE_FLAGS_ENABLED === 'true') {
		return (featureFlagName) => {
			const flagName = featureFlagName.trim();
			const staticflags = getStaticFlags(logger);
			logger.debug(`flags loaded: ${JSON.stringify(staticflags)}`);

			return staticflags?.[flagName] ?? false;
		};
	}

	if (process.env.FEATURE_FLAGS_SETTING === 'ALL_ON') {
		return async () => true;
	}

	if (!client) {
		logger.debug(
			'Returning false for all feature flags because no Azure App Config client exists.'
		);
		return async () => false;
	}

	return async (featureFlagName) => {
		const flagName = featureFlagName.trim();
		logger.debug(`Retrieving configuration for feature flag with name '${flagName}'`);
		if (!flagName) {
			logger.error('A feature flag key must be supplied.');
			return false;
		}

		const flagConfiguration = await client
			.getConfigurationSetting({
				key: `.appconfig.featureflag/${flagName}`
			})
			.catch((err) => {
				logger.error(err);
				return null;
			});

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
