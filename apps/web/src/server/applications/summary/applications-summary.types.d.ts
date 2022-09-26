import { Application, DomainType } from '../applications.types';
import { ValidationErrors } from '@pins/express';

export type ApplicationSummaryProps = {
	values: { reference: string };
};
