import findAddressListByPostcode from '../../../../../common/services/address.service.js';

/**
 * @typedef {object} AddressList
 * @property {string} apiReference
 */

/**
 * @param {string} postcode
 * @returns {Promise<AddressList[]>}
 */
export const getAddressList = async (postcode) => {
	const { addressList } = await findAddressListByPostcode(postcode, {
		maxResults: 50
	});

	return addressList;
};
