import {Sector, SelectItem, ZoomLevel} from '../../applications.types';
import { ValidationErrors } from '@pins/express';


export interface ApplicationCreateProps<BodyValues> {
	errors?: ValidationErrors,
	values: BodyValues
}

// Name and description
export interface ApplicationsCreateCaseNameBody extends Record<string, string|undefined> {
	title: string,
	description: string
}
export interface ApplicationsCreateCaseNameProps extends ApplicationCreateProps<ApplicationsCreateCaseNameBody>{}


// Sector
export interface ApplicationsCreateCaseSectorBody extends Record<string, string|undefined>{
	sectorName?: string;
}
export interface ApplicationsCreateCaseSectorProps extends ApplicationCreateProps<ApplicationsCreateCaseSectorBody>{
	sectors: Sector[];
}


// Sub sector
export interface ApplicationsCreateCaseSubSectorBody extends Record<string, string|undefined> {
	subSectorName?: string;
}
export interface ApplicationsCreateCaseSubSectorProps extends ApplicationCreateProps<ApplicationsCreateCaseSubSectorBody>{
	subSectors: Sector[];
}


//Geo Info
export interface ApplicationsCreateCaseGeographicalInformationBody extends Record<string, string|undefined> {
	'geographicalInformation.locationDescription'?: string,
	'geographicalInformation.gridReference.easting'?: string,
	'geographicalInformation.gridReference.northing'?: string
}
export interface ApplicationsCreateCaseGeographicalInformationProps extends ApplicationCreateProps<ApplicationsCreateCaseGeographicalInformationBody>{}


// Regions
export interface ApplicationsCreateCaseRegionsBody extends Record<string, string|undefined> {
	'geographicalInformation.regionNames'?: string[];
}
export interface ApplicationsCreateCaseRegionsProps {
	regions: SelectItem[],
	errors?: ValidationErrors,
}


// Zoom Level
export interface ApplicationsCreateCaseZoomLevelBody extends Record<string, string|undefined> {
	'geographicalInformation.mapZoomLevelName'?: string;
}
export interface ApplicationsCreateCaseZoomLevelProps extends ApplicationCreateProps<ApplicationsCreateCaseZoomLevelBody> {
	zoomLevels: ZoomLevel[];
}


// Team email
export interface ApplicationsCreateCaseTeamEmailBody extends Record<string, string|undefined>{
	caseEmail?: string;
}
export interface ApplicationsCreateCaseTeamEmailProps extends ApplicationCreateProps<ApplicationsCreateCaseTeamEmailBody>{}
