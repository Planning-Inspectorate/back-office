const formatAddressLowerCase = (address) => {
	return {
		...(address.addressLine1 && { addressLine1: address.addressLine1 }),
		...(address.addressLine2 && { addressLine2: address.addressLine2 }),
		...(address.town && { town: address.town }),
		...(address.county && { county: address.county }),
		postCode: address.postcode
	};
};

export default formatAddressLowerCase;
