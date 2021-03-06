import { ValidationErrors } from '@pins/express';
import { SelectItem } from '../../applications.types';

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
