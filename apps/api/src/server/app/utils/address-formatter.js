/**
 * @param {object} address address object
 * @returns {string} merged address parts into single string
 */
function formatAddress(address) {
	const addressParts = [
		address.addressLine1, 
		address.addressLine2, 
		address.addressLine3, 
		address.addressLine4, 
		address.addressLine5, 
		address.addressLine6, 
		address.city, 
		address.postcode
	].filter((x) => !!x);
	return addressParts.join(', ');
}

export default formatAddress;
