export interface OSApiAddress {
	DPA: {
		UPRN: string;
		UDPRN: string;
		DEPARTMENT_NAME: string;
		SUB_BUILDING_NAME: string;
		BUILDING_NAME: string;
		ADDRESS: string;
		POSTCODE: string;
		ORGANISATION_NAME: string;
		POST_TOWN: string;
		THOROUGHFARE_NAME: string;
		BUILDING_NUMBER: string;
	};
}

export interface address {
	apiReference: string;
	addressLine1: string;
	addressLine2: string;
	displayAddress: string;
	postcode: string;
	town: string;
}

export type ValidationErrors = {
	apiKey?: { msg: string };
	postcode?: { msg: string };
};

export const findAddressListByPostcode: (
	postcode: string,
	options?: { maxResults: number }
) => Promise<{ addressList: address[]; errors?: ValidationErrors }>;

declare const addressLookup: {
	findAddressListByPostcode;
};

export default addressLookup;
