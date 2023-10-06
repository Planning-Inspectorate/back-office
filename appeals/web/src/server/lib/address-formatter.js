import { join, map, pick } from 'lodash-es';

/**
 * converts a multi part address to a single string
 *
 * @param {import('@pins/appeals').Address} address
 * @returns {string}
 */
export const addressToString = (address) => {
	return join(
		map(pick(address, ['addressLine1', 'addressLine2', 'town', 'county', 'postCode']), (value) => {
			return value?.trim();
		}).filter((value) => value?.length),
		', '
	);
};
