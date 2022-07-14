import { Address } from './address';

export interface GridReference {
	easting?: string;
	northing?: string;
}

export interface GeographicalInformation {
	mapZoomLevel?: MapZoomLevelType;
	locationDescription?: string;
	gridReference?: GridReference;
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
	firstNotifiedDate?: Date;
	submissionDate?: Date;
}

export interface CreateUpdateApplication {
	title?: string;
	description?: string;
	subSectorName?: string;
	geographicalInformation?: GeographicalInformation;
	applicant?: Applicant;
	keyDates?: KeyApplicationDates;
}
