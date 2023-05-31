import * as validators from './utils/common-validators.js';

export const contactDetailsValidation = [
	validators.validateOrganisationName,
	validators.validateFirstName,
	validators.validateLastName,
	validators.validateJobTitle,
	validators.validateEmail,
	validators.validatePhoneNumber
];
