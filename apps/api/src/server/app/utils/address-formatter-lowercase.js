const formatAddressLowerCase = function(address) {
	return {
		addressLine1: address.addressLine1,
		addressLine2: address.addressLine2,
		town: address.town,
		county: address.county,
		postCode: address.postcode
	};
};

export default formatAddressLowerCase;
