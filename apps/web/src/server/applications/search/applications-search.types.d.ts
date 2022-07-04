import { Application, DomainType } from '../applications.types';
import { ValidationErrors } from '@pins/express';

export type ApplicationsSearchResultsBody = {
	query: string;
	role: DomainType;
	pageNumber: number;
	pageSize: number;
};

export type ApplicationsSearchResultsProps = {
	searchApplicationsItems?: Partial<Application>[];
	query?: string;
	errors?: ValidationErrors;
};
