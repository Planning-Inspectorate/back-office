import { isFeatureFlag, parseFeatureFlag } from '@azure/app-configuration';
import staticFlags from './static-feature-flags.js';

/**
 * @typedef {() => Promise<Record<string, boolean>>} ListFlagsFn
 * */

/**
 * @param {import('./feature-flag-client.js').Logger} logger
 * @param {import('@azure/app-configuration').AppConfigurationClient} [client]
 * @param {boolean} [useStaticFlags]
 * @returns {ListFlagsFn}
 * */
export const makeListFlags = (logger, client, useStaticFlags) => async () => {
	if (useStaticFlags) {
		logger.debug('returning static feature flags (STATIC_FEATURE_FLAGS_ENABLED=true)');
		return staticFlags;
	}

	if (!client) {
		logger.debug(
			'Cannot list flags because no Azure App Config client exists. Returning an empty object.'
		);
		return {};
	}

	const aacResult = await client.listConfigurationSettings();

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

	return flags;
};
