import { join, map, pick } from 'lodash-es';

/**
 * converts a multi part address to a single string
 *
 * @param {{addressLine1:string, addressLine2:string, town:string, postCode:string}} address
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
