import { isFeatureFlag, parseFeatureFlag } from '@azure/app-configuration';

/**
 * @typedef {() => Promise<Record<string, boolean>>} ListFlagsFn
 * */

/**
 * @param {import('./feature-flag-client.js').Logger} logger
 * @param {import('@azure/app-configuration').AppConfigurationClient} client
 * @returns {ListFlagsFn}
 * */
export const makeListFlags = (logger, client) => async () => {
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
