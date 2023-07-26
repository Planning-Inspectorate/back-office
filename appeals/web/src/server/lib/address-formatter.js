import { join, map, pick } from 'lodash-es';

/**
 * converts a multi part address to a single string
 *
 * @param {{ addressLine1:string, addressLine2:string, town:string, county:string, postCode:string}} address
 * @returns {string}
 */
export const addressToString = (address) => {
	return join(
		map(pick(address, ['addressLine1', 'addressLine2', 'town', 'county', 'postCode']), (value) => {
			return value?.trim();
		}).filter((value) => value.length),
		', '
	);
};
