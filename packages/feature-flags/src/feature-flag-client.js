import { AppConfigurationClient } from '@azure/app-configuration';
import { makeIsFeatureActive } from './is-feature-active.js';

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

	this.isFeatureActive = makeIsFeatureActive(logger, this.client);
}
