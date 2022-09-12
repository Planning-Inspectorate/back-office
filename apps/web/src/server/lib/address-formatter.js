import { join, map, pick } from 'lodash-es';

/** @typedef {import('../applications/applications.types').ApplicationsAddress} ApplicationsAddress */

/**
 * converts a multi part address to a single string
 *
 * @param {ApplicationsAddress} address
 * @returns {string}
 */
export const addressToString = (address) => {
	return join(
		map(pick(address, ['addressLine1', 'addressLine2', 'town', 'postCode']), (value) => {
			return value?.trim();
		}),
		', '
	);
};
