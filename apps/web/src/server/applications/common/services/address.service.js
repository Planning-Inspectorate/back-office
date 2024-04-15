import config from '@pins/applications.web/environment/config.js';
import { findAddressListByPostcode } from '@planning-inspectorate/address-lookup';
import path from 'node:path';
import fs from 'node:fs/promises';

/** @typedef {import('@planning-inspectorate/address-lookup').address} address */
/** @typedef {import('@planning-inspectorate/address-lookup').ValidationErrors} AddressLookupValidationErrors */

/**
 * Only lookup addresses when not in development *
 *
 * @param {string} postcode
 * @param {any} locals
 * @returns {Promise<{addressList: address[]; errors?: AddressLookupValidationErrors}>}
 */
export default async function (postcode, locals) {
	if (!config.dummyAddressData) {
		return findAddressListByPostcode(postcode, locals);
	}

	const dummyAddressDataFile = path.join(process.cwd(), 'dummy_address_data.json');
	const dummyAddressData = JSON.parse(await fs.readFile(dummyAddressDataFile, 'utf8'));
	return { addressList: dummyAddressData[postcode] };
}
