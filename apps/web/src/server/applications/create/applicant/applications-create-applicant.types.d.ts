import { ValidationErrors } from '@pins/express';
import { OptionsItem } from '../../applications.types';

export type ApplicationsCreateApplicantTypesProps = {
	applicantInfoTypes: OptionsItem[];
	errors?: ValidationErrors;
};
