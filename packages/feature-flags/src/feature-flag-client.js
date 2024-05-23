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
 * @param {boolean} [useStaticFlags]
 * */
export function FeatureFlagClient(logger, connectionString, useStaticFlags) {
	/** @type {import('@azure/app-configuration').AppConfigurationClient | undefined} */
	this.client = (() => {
		if (!connectionString) {
			return;
		}

		try {
			return new AppConfigurationClient(connectionString);
		} catch (err) {
			logger.debug('Failed to create AppConfigurationClient due to error:');
			logger.debug(err);

			return;
		}
	})();

	/** @type {import('./is-feature-active.js').IsFeatureActiveFn} */
	this.isFeatureActive = makeIsFeatureActive(logger, this.client, useStaticFlags);

	/** @type {import('./list-flags.js').ListFlagsFn} */
	this.listFlags = makeListFlags(logger, this.client, useStaticFlags);
}
