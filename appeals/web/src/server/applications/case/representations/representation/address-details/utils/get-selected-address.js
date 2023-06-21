import { getAddressList } from './get-address-list.js';

/**
 * @param {*} selectedAddress
 * @returns {object}
 */
const addCountryToSelectedAddress = (selectedAddress) => ({
	...selectedAddress,
	country: 'Great Britain'
});

/**
 * @param {*} selectedAddress
 * @returns {object}
 */
const trimSelectedAddressValues = (selectedAddress) =>
	Object.keys(selectedAddress).reduce(
		(acc, selectedAddressProperty) => ({
			...acc,
			[selectedAddressProperty]: selectedAddress[selectedAddressProperty].trim()
		}),
		{}
	);

/**
 * @typedef {object} AddressList
 * @property {string|null} apiReference
 */

/**
 * @param {Array<AddressList>} addressList
 * @param {string} address
 * @returns {object|undefined}
 */
const findSelectedAddress = (addressList, address) =>
	addressList.find((addressListItem) => addressListItem.apiReference === address);

/**
 * @param {object} addressDetails
 * @param {string} addressDetails.address
 * @param {string} postcode
 * @returns {Promise<object>}
 */
export const getSelectedAddress = async ({ address }, postcode) => {
	const addressList = await getAddressList(postcode);
	const selectedAddress = findSelectedAddress(addressList, address);
	const selectedAddressWithTrimmedValues = trimSelectedAddressValues(selectedAddress);

	return addCountryToSelectedAddress(selectedAddressWithTrimmedValues);
};
