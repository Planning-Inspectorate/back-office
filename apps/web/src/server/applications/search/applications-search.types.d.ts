import { ApplicationSummary, DomainType } from '../applications.types';

export type SearchApplicationsRequestBody = {
	query: string;
	role: DomainType;
	pageNumber: number;
	pageSize: number;
};

export type SearchApplicationResponse = {
	page: number;
	pageSize: number;
	pageCount: number;
	itemCount: number;
	items: SearchApplicationItem[];
};

export type SearchApplicationItem = {
	id: number;
	title: string;
	reference: string;
	modifiedDate: string;
	publishedDate: string;
};
