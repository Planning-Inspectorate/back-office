import { Address } from './address';

export interface GridReference {
	id: number;
	easting: number | null;
	northing: number | null;
	caseId?: number;
}

export interface GeographicalInformation {
	mapZoomLevelName?: MapZoomLevelType;
	locationDescription?: string;
	gridReference?: GridReference;
	regionNames?: string[];
}

export type MapZoomLevelType =
	| 'Country'
	| 'Region'
	| 'County'
	| 'Borough'
	| 'District'
	| 'City'
	| 'Town'
	| 'Junction'
	| 'None';

export interface Applicant {
	id?: number;
	organisationName?: string;
	firstName?: string;
	middleName?: string;
	lastName?: string;
	email?: string;
	address?: Address;
	website?: string;
	phoneNumber?: string;
}

export interface KeyApplicationDates {
	preApplication?: PreApplicationDates;
}

export interface PreApplicationDates {
	firstNotifiedDate?: Date;
	submissionDate?: Date;
}

export type ApplicationStageType =
	| 'pre_application'
	| 'acceptance'
	| 'pre_examination'
	| 'examination'
	| 'recommendation'
	| 'decision'
	| 'post_decision'
	| 'withdrawn'
	| 'developers_application';

export interface CreateUpdateApplication {
	title?: string;
	description?: string;
	caseEmail?: string;
	subSectorName?: string;
	stage?: ApplicationStageType;
	geographicalInformation?: GeographicalInformation;
	applicant?: Applicant;
	keyDates?: KeyApplicationDates;
}
