import { ValidationErrors } from '@pins/express';
import { ApplicationsAddress, SelectItem } from '../../applications.types';

export type ApplicationsCreateApplicantTypesProps = {
	applicantInfoTypes: SelectItem[];
	errors?: ValidationErrors;
};

export type ApplicationsCreateApplicantTypesBody = {
	selectedApplicantInfoTypes: string[];
};

export type ApplicationsCreateApplicantOrganisationNameProps = {
	values: { 'applicant.organisationName'?: string };
	errors?: ValidationErrors;
};

export type ApplicationsCreateApplicantOrganisationNameBody = {
	applicantOrganisationName?: string;
};

export type ApplicationsCreateApplicantFullNameProps = {
	values: {
		'applicant.firstName'?: string;
		'applicant.middleName'?: string;
		'applicant.lastName'?: string;
	};
	errors?: ValidationErrors;
};

export type ApplicationsCreateApplicantFullNameBody = {
	applicantfirstName?: string;
	applicantmiddleName?: string;
	applicantlastName?: string;
};

export type ApplicationCreateApplicantAddressStage =
	| 'searchPostcode'
	| 'selectAddress'
	| 'manualAddress';
export type ApplicationsCreateApplicantAddressProps = {
	formStage: ApplicationCreateApplicantAddressStage;
	errors?: Record<string, { msg: string }> | ValidationErrors;
	postcode: string;
	addressList?: ApplicationAddress[];
};

export type ApplicationsCreateApplicantAddressBody = {
	postcode: string;
	apiReference?: string;
	currentFormStage: ApplicationCreateApplicantAddressStage;
	'applicant.address.addressLine1'?: string;
	'applicant.address.addressLine2'?: string;
	'applicant.address.town'?: string;
};
