/**
 * @param {{addressLine1: string, addressLine2: string, town: string, county: string, postcode: string}} address
 * @returns {{AddressLine1?: string, AddressLine2?: string, Town?: string, County?: string, PostCode: string}}
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
