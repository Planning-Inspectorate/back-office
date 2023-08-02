import { ValidationErrors } from '@pins/express';

export type PaginatedResponse<T> = {
	items: T[];
	page: number;
	pageSize: number;
	pageDefaultSize: number;
	pageCount: number;
	itemCount: number;
};

export type SelectItem = {
	value: string;
	text: string;
	checked?: boolean;
	selected?: boolean;
};

export type DomainType = 'case-team' | 'case-admin-officer' | 'inspector';

export type FormCaseLayout = {
	pageTitle: string;
	components: string[];
	isEdit?: boolean;
	backLink?: string;
};

export interface Case {
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
	applicants?: Applicant[];
	keyDates?: {
		submissionDatePublished: string;
		submissionDateInternal: string;
	};
	geographicalInformation?: {
		mapZoomLevel: ZoomLevel;
		regions: Region[];
		locationDescription: string;
		gridReference: {
			northing: string;
			easting: string;
		};
	};
}

export interface Applicant {
	id: number;
	organisationName: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	email: string;
	website: string;
	phoneNumber: string;
	address?: ApplicationsAddress;
}
// TODO: unify with appeals address
export interface ApplicationsAddress {
	postCode: string;
	addressLine1: string;
	addressLine2?: string;
	town: string;
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
export interface DocumentationCategory extends OptionsItem {}
export interface ExaminationTimetableType extends OptionsItem {
	templateType?: string;
}

export interface CaseCreateProps<BodyValues> {
	errors?: ValidationErrors;
	values: BodyValues;
	layout?: FormCaseLayout;
}

export interface DocumentationFile {
	documentGuid: string;
	fileName: string;
	description: string;
	dateCreated: number;
	datePublished?: number;
	size: number;
	mime: string;
	publishedStatus: string;
	redactedStatus: string;
	privateBlobContainer?: string;
	privateBlobPath?: string;
	filter1: string;
	author: string;
	representative: string;
	stage: string;
	documentType: string;
	folderId?: number;
}

export interface DocumentVersion {
	version: number;
	fileName: string;
	redacted: boolean;
	documentGuid: string;
	mime: string;
	size: number;
	history: {
		created: {
			name: string;
			username: string;
			date: number;
		};
		published: {
			name: string;
			username: string;
			date: number;
		} | null;
		unpublished: {
			name: string;
			username: string;
			date: number;
		} | null;
	};
}

export interface S51Advice {
	title?: string;
	enquirerFirstName: string;
	enquirerLastName: string;
	enquirerOrganisation: string;
	enquiryMethod: string;
	'enquiryDate.day'?: string;
	'enquiryDate.month'?: string;
	'enquiryDate.year'?: string;
	enquiryDetails: string;
	adviser: string;
	'adviceDate.day'?: string;
	'adviceDate.month'?: string;
	'adviceDate.year'?: string;
	adviceDetails: string;
}
