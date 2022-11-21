import pino from './logger.js';

/**
 * TODO: set this Type properly when we know how to import this in
 * converts a multi part address to a single string
 *
 * @type {*}
 */
const featureFlags = {};

/**
 * converts a multi part address to a single string
 *
 * @param {string} featureFlagName
 * @returns {boolean}
 */

export const isFeatureActive = (featureFlagName) => {
	pino.info(`flag name: ${featureFlagName}`);

	if (!featureFlagName) {
		// logger.error('A feature flag key must be supplied.');
		return false;
	}

	pino.info(`is flag enabled: ${featureFlags[featureFlagName]}`);

	return featureFlags[featureFlagName];
};
