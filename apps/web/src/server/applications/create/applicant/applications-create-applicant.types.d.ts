import { ValidationErrors } from '@pins/express';
import { OptionsItem } from '../../applications.types';

export type ApplicationsCreateApplicantTypesProps = {
	applicantInfoTypes: OptionsItem[];
	depth: number;
	errors?: ValidationErrors;
};

export type ApplicationsCreateApplicantTypesBody = {
	selectedApplicantInfoTypes: string[];
};
