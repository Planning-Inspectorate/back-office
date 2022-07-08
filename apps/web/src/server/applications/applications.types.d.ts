export type PaginatedResponse<T> = {
	items: T[];
	page: number;
	pageSize: number;
	pageCount: number;
	itemCount: number;
};

export type DomainType = 'case-officer' | 'case-admin-officer' | 'inspector';

export interface Application {
	id: number;
	reference: string;
	description: string;
	status: string;
	title: string;
	modifiedDate?: string;
	publishedDate?: string;
	createdDate?: string;
	sector?: Sector;
	subSector?: Sector;
}

export interface OptionsItem {
	id: number;
	name: string;
	displayNameEn: string;
	displayNameCy: string;
	abbreviation?: string;
}

export interface Sector extends OptionsItem {}
export interface Region extends OptionsItem {}
