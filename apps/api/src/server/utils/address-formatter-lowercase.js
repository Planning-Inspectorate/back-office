/**
 *
 * @param {{addressLine1: string, addressLine2: string, town: string, county: string, postcode: string}} address
 * @returns {{addressLine1?: string, addressLine2?: string, town?: string, county?: string, postCode: string}}
 */
const formatAddressLowerCase = (address) => {
	return {
		...(address?.addressLine1 && { addressLine1: address.addressLine1 }),
		...(address?.addressLine2 && { addressLine2: address.addressLine2 }),
		...(address?.town && { town: address.town }),
		...(address?.county && { county: address.county }),
		postCode: address?.postcode
	};
};

export default formatAddressLowerCase;
