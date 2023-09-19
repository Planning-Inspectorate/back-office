/** @typedef {import('@pins/appeals.api').Schema.Address} Address */
/** @typedef {import('@pins/appeals.api').Appeals.SingleAddressResponse} SingleAddressResponse */

/**
 * @param {Address} address
 * @returns {SingleAddressResponse}
 */
const formatAddress = (address) => ({
	addressId: address.id,
	addressLine1: address.addressLine1,
	addressLine2: address.addressLine2,
	country: address.addressCountry,
	county: address.addressCounty,
	postcode: address.postcode,
	town: address.addressTown
});

export { formatAddress };
