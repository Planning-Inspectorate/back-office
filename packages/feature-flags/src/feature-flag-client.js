import { AppConfigurationClient } from '@azure/app-configuration';
import { makeIsFeatureActive } from './is-feature-active.js';
import { makeListFlags } from './list-flags.js';

/**
 * @typedef {Function} LoggerFn
 * @param {...string} args
 * @returns {void}
 * */

/**
 * @typedef {{ debug: LoggerFn, error: LoggerFn }} Logger
 * */

/**
 * @param {Logger} logger
 * @param {string} [connectionString]
 * */
export function FeatureFlagClient(logger, connectionString) {
	this.client = connectionString ? new AppConfigurationClient(connectionString) : undefined;

	/** @type {import('./is-feature-active.js').IsFeatureActiveFn} */
	this.isFeatureActive = makeIsFeatureActive(logger, this.client);

	/** @type {import('./list-flags.js').ListFlagsFn} */
	this.listFlags = (() => {
		if (!this.client) {
			logger.debug('Cannot list flags because no Azure App Config client exists.');
			return async () => ({});
		}

		return makeListFlags(logger, this.client);
	})();
}