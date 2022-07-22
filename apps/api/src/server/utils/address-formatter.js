/**
 * @param {import('@pins/api').Schema.Address | undefined} address
 * @returns {{AddressLine1?: string, AddressLine2?: string, Town?: string, County?: string, PostCode?: string | null}}
 */
function formatAddress(address) {
	if (typeof address !== 'undefined') {
		return {
			...(address.addressLine1 && { AddressLine1: address.addressLine1 }),
			...(address.addressLine2 && { AddressLine2: address.addressLine2 }),
			...(address.town && { Town: address.town }),
			...(address.county && { County: address.county }),
			PostCode: address.postcode
		};
	}
	return {};
}

export default formatAddress;
