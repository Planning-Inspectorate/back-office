import config from '../../config/config.js';
import pino from './logger.js';

/**
 *
 * @param {string} featureFlagName
 * @returns {boolean}
 */

export const isFeatureActive = (featureFlagName) => {
	pino.info(`flag name: ${featureFlagName}`);

	if (
		!featureFlagName ||
		!Object.prototype.hasOwnProperty.call(config.featureFlags, featureFlagName)
	) {
		pino.info(`a flag name must be supplied: ${featureFlagName} does not exist`);
		// we assume the flag doesn't exists so the feature is available
		return true;
	}

	pino.info(`is flag ${featureFlagName} enabled: ${config.featureFlags[featureFlagName]}`);

	return config.featureFlags[featureFlagName];
};
