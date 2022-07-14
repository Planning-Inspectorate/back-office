import { Address } from './address';

export interface GridReference {
	easting?: string;
	northing?: string;
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
<<<<<<< HEAD
	caseEmail?: string;
=======
>>>>>>> 78064201 (feat(api/applications): creates endpoint to create applications (BOAS-129))
	subSectorName?: string;
	geographicalInformation?: GeographicalInformation;
	applicant?: Applicant;
	keyDates?: KeyApplicationDates;
}
