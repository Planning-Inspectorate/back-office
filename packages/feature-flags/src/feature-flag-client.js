import { AppConfigurationClient, isFeatureFlag, parseFeatureFlag } from '@azure/app-configuration';
import staticFlags from './static-feature-flags.js';

/**
 * @typedef {Function} LoggerFn
 * @param {...string} args
 * @returns {void}
 * */

/**
 * @typedef {{ debug: LoggerFn, error: LoggerFn }} Logger
 * */

export class FeatureFlagClient {
	/**
	 * @param {Logger} logger
	 * @param {string} [connectionString]
	 * @param {boolean} [useStaticFlags]
	 * */
	constructor(logger, connectionString, useStaticFlags) {
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

		/** @type {Record<string, boolean>} */
		this.featureFlags = {};

		this._logger = logger;
		this._useStaticFlags = useStaticFlags;
	}

	/** @type {(flagName: string) => boolean} */
	isFeatureActive(flagName) {
		return this.featureFlags[flagName] ?? false;
	}

	/** @type {() => Promise<void>} */
	async loadFlags() {
		if (this._useStaticFlags) {
			this._logger.debug('returning static feature flags (STATIC_FEATURE_FLAGS_ENABLED=true)');
			this.featureFlags = staticFlags;
			return;
		}

		if (!this.client) {
			this._logger.debug(
				'Cannot load flags because no Azure App Config client exists. Returning an empty object.'
			);
			this.featureFlags = {};
			return;
		}

		const aacResult = await this.client.listConfigurationSettings();

		/** @type {Record<string, boolean>} */
		let flags = {};

		for await (const setting of aacResult) {
			if (!isFeatureFlag(setting)) {
				continue;
			}

			const flag = parseFeatureFlag(setting);
			if (!flag.value.id) {
				continue;
			}

			const { id, enabled } = flag.value;

			if (process.env.FEATURE_FLAGS_SETTING === 'ALL_ON') {
				flags[id] = true;
				continue;
			}

			flags[id] = enabled;
		}

		this.featureFlags = flags;
	}
}
