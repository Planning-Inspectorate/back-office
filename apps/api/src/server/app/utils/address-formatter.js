/**
 * @param {object} address address object
 * @returns {string} merged address parts into single string
 */
function formatAddress(address) {
	return {
		AddressLine1: address.addressLine1,
		AddressLine2: address.addressLine2,
		Town: address.town,
		County: address.county,
		PostCode: address.postcode
	};
}

export default formatAddress;
