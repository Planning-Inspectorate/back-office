import { AppConfigurationClient, isFeatureFlag, parseFeatureFlag } from '@azure/app-configuration';
import staticFlags, { flagsByReference } from './static-feature-flags.js';

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
		/**
		 * An array of case reference for each feature flag entry.
		 * If a case reference is not present, the feature flag is not enabled for that case.
		 * @type {Record<string, string[]>}
		 */
		this.featureFlagsByCaseReference = {};

		this._logger = logger;
		this._useStaticFlags = useStaticFlags;
	}

	/**
	 * Checks if a feature flag is active for a specific case reference.
	 * If the flag is globally active, it returns true.
	 *
	 * @param {string} flagName
	 * @param {string} caseReference
	 * @returns {boolean}
	 */
	isFeatureActiveForCase(flagName, caseReference) {
		// If the flag is globally active, return true
		if (this.isFeatureActive(flagName)) {
			return true;
		}
		if (!(flagName in this.featureFlagsByCaseReference)) {
			return false;
		}

		return this.featureFlagsByCaseReference[flagName]?.includes(caseReference);
	}

	/**
	 * Checks if a feature flag is active globally.
	 * @param {string} flagName
	 * @returns {boolean}
	 */
	isFeatureActive(flagName) {
		return this.featureFlags[flagName] ?? false;
	}

	/** @type {() => Promise<void>} */
	async loadFlags() {
		if (this._useStaticFlags) {
			this._logger.debug('returning static feature flags (STATIC_FEATURE_FLAGS_ENABLED=true)');
			this.featureFlags = staticFlags;
			this.featureFlagsByCaseReference = flagsByReference;
			return;
		}

		if (!this.client) {
			this._logger.debug(
				'Cannot load flags because no Azure App Config client exists. Returning an empty object.'
			);
			this.featureFlags = {};
			this.featureFlagsByCaseReference = {};
			return;
		}

		const aacResult = await this.client.listConfigurationSettings();

		/** @type {Record<string, boolean>} */
		const flags = {};
		/** @type {Record<string, string[]>} */
		const flagsByCaseReference = {};

		for await (const setting of aacResult) {
			if (!isFeatureFlag(setting)) {
				continue;
			}

			const flag = parseFeatureFlag(setting);
			if (!flag.value.id) {
				continue;
			}

			const { id, enabled, conditions } = flag.value;

			if (process.env.FEATURE_FLAGS_SETTING === 'ALL_ON') {
				flags[id] = true;
				continue;
			}

			if (!enabled) {
				flags[id] = false;
				continue;
			}

			if (Array.isArray(conditions?.clientFilters) && conditions.clientFilters.length > 0) {
				const filter = conditions.clientFilters[0];
				if (isAudienceFilter(filter)) {
					if (filter.parameters.Audience.Users.length === 0) {
						flags[id] = enabled;
					} else {
						flagsByCaseReference[id] = filter.parameters.Audience.Users || [];
					}
				}
				continue;
			}

			flags[id] = enabled;
		}

		this.featureFlags = flags;
		this.featureFlagsByCaseReference = flagsByCaseReference;
	}
}

/**
 * @param {{ name: string; parameters?: Record<string, unknown>;}} filter
 * @returns {filter is { name: string; parameters: {Audience: {Users: string[]}}}}
 */
function isAudienceFilter(filter) {
	if (!filter || typeof filter !== 'object') {
		return false;
	}
	if (!filter.parameters) {
		return false;
	}
	const parameters = filter.parameters;
	if (!hasAudienceValue(parameters)) {
		return false;
	}
	return Array.isArray(parameters.Audience.Users);
}

/**
 * @param {Record<string, unknown>} parameters
 * @returns {parameters is {Audience: {Users: string[]}}}
 */
function hasAudienceValue(parameters) {
	if (!parameters || typeof parameters !== 'object') {
		return false;
	}
	return 'Audience' in parameters;
}
