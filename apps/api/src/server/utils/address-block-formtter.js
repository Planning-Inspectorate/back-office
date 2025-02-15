/**
 * @param {import('@pins/applications.api').Schema.Address | null | undefined} address
 * @returns {{addressLine1?: string, addressLine2?: string, town?: string, county?: string, country?: string, postCode?: string | null}}
 */
function formatAddress(address) {
	if (address) {
		return {
			...(address.addressLine1 && { addressLine1: address.addressLine1 }),
			...(address.addressLine2 && { addressLine2: address.addressLine2 }),
			...(address.town && { town: address.town }),
			...(address.county && { county: address.county }),
			...(address.country && { country: address.country }),
			postCode: address.postcode
		};
	}
	return {};
}

export default formatAddress;
