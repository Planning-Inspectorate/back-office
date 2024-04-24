/** @typedef {import('../../applications/applications.types.js').ApplicationsAddress} ApplicationsAddress */

import { addressToString } from '../address-formatter.js';
/**
 * Accepts an address (all optional)
 * and formats the address nicely into a single string.
 *
 * @param {Partial<ApplicationsAddress>} address
 * @returns {string}
 * */
export function formatAddress(address = {}) {
	return addressToString(address);
}
