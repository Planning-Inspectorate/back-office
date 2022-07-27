export type PaginatedResponse<T> = {
	items: T[];
	page: number;
	pageSize: number;
	pageCount: number;
	itemCount: number;
};

export type SelectItem = {
	value: string;
	text: string;
	checked?: boolean;
	selected?: boolean;
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
	caseEmail?: string;
	geographicalInformation?: {
		mapZoomLevel: ZoomLevel,
		regions: Region[],
		locationDescription: string;
		gridReference: {
			northing: string;
			easting: string;
		};
	};
}

export interface OptionsItem {
	id?: number;
	name: string;
	displayNameEn: string;
	displayNameCy: string;
	abbreviation?: string;
	displayOrder?: number;
}

export interface Sector extends OptionsItem {}
export interface Region extends OptionsItem {}
export interface ZoomLevel extends OptionsItem {}
