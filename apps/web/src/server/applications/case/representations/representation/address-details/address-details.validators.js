import * as validators from './utils/common-validators.js';

export const addressDetailsValidation = [
	validators.validateLookupPostcode,
	validators.validateAddress,
	validators.validateAddressLineOne,
	validators.validateAddressLineTwo,
	validators.validateAddressTown,
	validators.validateAddressPostcode,
	validators.validateAddressCountry
];
