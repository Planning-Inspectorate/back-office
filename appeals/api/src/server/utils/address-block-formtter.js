/**
 * @param {import('@pins/appeals.api').Schema.Address | null | undefined} address
 * @returns {{addressLine1?: string, addressLine2?: string, town?: string, county?: string, postCode?: string | null}}
 */
function formatAddress(address) {
	if (address) {
		return {
			...(address.addressLine1 && { addressLine1: address.addressLine1 }),
			...(address.addressLine2 && { addressLine2: address.addressLine2 }),
			...(address.town && { town: address.town }),
			...(address.county && { county: address.county }),
			postCode: address.postcode
		};
	}
	return {};
}

export default formatAddress;
