// @ts-nocheck
// TODO: schemas (PINS data model)

export const mapAddressIn = (appeal) => {
	return {
		addressLine1: appeal.siteAddressLine1,
		addressLine2: appeal.siteAddressLine2,
		addressCounty: appeal.siteAddressCounty,
		postcode: appeal.siteAddressPostcode
	};
};

export const mapAddressOut = (appeal) => {
	return {
		siteAddressLine1: appeal.address.addressLine1,
		siteAddressLine2: appeal.address.addressLine2,
		siteAddressCounty: appeal.address.addressCounty,
		siteAddressPostcode: appeal.address.postcode
	};
};
