import config from '../../config/config.js';
import pino from './logger.js';

/**
 *
 * @param {string | null} featureFlagName
 * @returns {boolean}
 */

export const isFeatureActive = (featureFlagName = null) => {
	pino.info(`[STORAGE] flag name: ${featureFlagName}`);

	if (
		!featureFlagName ||
		!Object.prototype.hasOwnProperty.call(config.featureFlags, featureFlagName)
	) {
		pino.info(`[STORAGE] a flag name must be supplied: ${featureFlagName} does not exist`);
		return false;
	}

	pino.info(
		`[STORAGE] is flag ${featureFlagName} enabled: ${config.featureFlags[featureFlagName]}`
	);

	return config.featureFlags[featureFlagName];
};
