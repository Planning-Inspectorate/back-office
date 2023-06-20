import config from '@pins/appeals.web/environment/config.js';
import pino from '@pins/appeals.web/src/server/lib/logger.js';

/**
 *
 * @param {string | null} featureFlagName?
 * @returns {boolean}
 */

export const isFeatureActive = (featureFlagName = null) => {
	pino.info(`[WEB] flag name: ${featureFlagName}`);

	if (
		!featureFlagName ||
		!Object.prototype.hasOwnProperty.call(config.featureFlags, featureFlagName)
	) {
		pino.info(`[WEB] a flag name must be supplied: ${featureFlagName} does not exist`);
		return false;
	}

	pino.info(`[WEB] is flag ${featureFlagName} enabled: ${config.featureFlags[featureFlagName]}`);

	return config.featureFlags[featureFlagName];
};
