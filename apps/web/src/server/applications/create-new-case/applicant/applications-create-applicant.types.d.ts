import { ValidationErrors } from '@pins/express';
import { CaseCreateProps, FormCaseLayout, SelectItem } from '../../applications.types';

export type ApplicationsCreateApplicantTypesProps = {
	applicantInfoTypes: SelectItem[];
	errors?: ValidationErrors;
	layout?: FormCaseLayout;
};

export type ApplicationsCreateApplicantTypesBody = {
	selectedApplicantInfoTypes: string[];
};

// org name
export interface ApplicationsCreateApplicantOrganisationNameBody
	extends Record<string, string | undefined> {
	'applicant.organisationName'?: string;
}
export interface ApplicationsCreateApplicantOrganisationNameProps
	extends CaseCreateProps<ApplicationsCreateApplicantOrganisationNameBody> {}

// full name
export interface ApplicationsCreateApplicantFullNameBody
	extends Record<string, string | undefined> {
	'applicant.firstName'?: string;
	'applicant.middleName'?: string;
	'applicant.lastName'?: string;
}
export interface ApplicationsCreateApplicantFullNameProps
	extends CaseCreateProps<ApplicationsCreateApplicantFullNameBody> {}

//website
export interface ApplicationsCreateApplicantWebsiteBody extends Record<string, string | undefined> {
	'applicant.website'?: string;
}
export interface ApplicationsCreateApplicantWebsiteProps
	extends CaseCreateProps<ApplicationsCreateApplicantWebsiteBody> {}

//email
export interface ApplicationsCreateApplicantEmailBody extends Record<string, string | undefined> {
	'applicant.email'?: string;
}
export interface ApplicationsCreateApplicantEmailProps
	extends CaseCreateProps<ApplicationsCreateApplicantEmailBody> {}

// phone
export interface ApplicationsCreateApplicantTelephoneNumberBody
	extends Record<string, string | undefined> {
	'applicant.phoneNumber'?: string;
}
export interface ApplicationsCreateApplicantTelephoneNumberProps
	extends CaseCreateProps<ApplicationsCreateApplicantTelephoneNumberBody> {}

// address
export type ApplicationCreateApplicantAddressStage =
	| 'searchPostcode'
	| 'selectAddress'
	| 'manualAddress';
export type ApplicationsCreateApplicantAddressProps = {
	formStage: ApplicationCreateApplicantAddressStage;
	errors?: Record<string, { msg: string }> | ValidationErrors;
	postcode?: string;
	addressList?: ApplicationAddress[];
	layout?: FormCaseLayout;
	applicantAddress?: string;
};
export type ApplicationsCreateApplicantAddressBody = {
	postcode: string;
	apiReference?: string;
	currentFormStage: ApplicationCreateApplicantAddressStage;
	'applicant.address.addressLine1'?: string;
	'applicant.address.addressLine2'?: string;
	'applicant.address.town'?: string;
	skipButton?: object;
};
