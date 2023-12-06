import { Application } from '../../applications.types';
import { ValidationErrors } from '@pins/express';

export type ApplicationsSearchResultsBody = {
	query: string;
	pageNumber: number;
	pageSize: number;
};

export type Pagination = {
	previous: { href?: string };
	next: { href?: string };
	items: { number: number; href: string; current: boolean }[];
};

export type ApplicationsSearchResultsProps = {
	searchApplicationsItems: Partial<Application>[];
	query?: string;
	itemCount: number;
	pagination?: Pagination;
	errors?: ValidationErrors;
};
