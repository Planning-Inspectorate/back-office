export type PaginatedResponse<T> = {
	items: T[];
	page: number;
	pageSize: number;
	pageCount: number;
	itemCount: number;
};

export interface Sector {
	id: number;
	abbreviation: string;
	displayNameEn: string;
	displayNameCy?: string;
	name: string;
}

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

export interface Region {
	id: number;
	name: string;
	displayNameEn: string;
	displayNameCy: string;
}
