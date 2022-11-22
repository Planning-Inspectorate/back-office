import config from '@pins/web/environment/config.js';
import pino from '@pins/web/src/server/lib/logger.js';

/**
 *
 * @param {string} featureFlagName
 * @returns {boolean}
 */

export const isFeatureActive = (featureFlagName) => {
	pino.info(`[WEB] flag name: ${featureFlagName}`);

	if (
		!featureFlagName ||
		!Object.prototype.hasOwnProperty.call(config.featureFlags, featureFlagName)
	) {
		pino.info(`[WEB] a flag name must be supplied: ${featureFlagName} does not exist`);
		// we assume the flag doesn't exists so the feature is available
		return true;
	}

	pino.info(`[WEB] is flag ${featureFlagName} enabled: ${config.featureFlags[featureFlagName]}`);

	return config.featureFlags[featureFlagName];
};
