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
