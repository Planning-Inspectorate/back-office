/**
 * @param {object} address address object
 * @returns {string} merged address parts into single string
 */
function formatAddress(address) {
	return {
		...(address.addressLine1 && { AddressLine1: address.addressLine1 }),
		...(address.addressLine2 && { AddressLine2: address.addressLine2 }),
		...(address.town && { Town: address.town }),
		...(address.county && { County: address.county }),
		PostCode: address.postcode
	};
}

export default formatAddress;
