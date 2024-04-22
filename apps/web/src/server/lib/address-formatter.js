/** @typedef {import('../applications/applications.types').ApplicationsAddress} ApplicationsAddress */

import { pick } from 'lodash-es';

/**
 * converts a multi part address to a single string
 *
 * @param {Partial<ApplicationsAddress>} address
 * @returns {string}
 */
export const addressToString = (address = {}) => {
	const displayAddress = pick(address, [
		'addressLine1',
		'addressLine2',
		'town',
		'county',
		'postCode',
		'country'
	]);
	return Object.values(displayAddress)
		.map((value) => value?.trim())
		.filter((value) => !!value)
		.join(', ');
};
