import {
	CaseCreateProps,
	CaseStage,
	FormCaseLayout,
	Sector,
	SelectItem,
	ZoomLevel,
	isMaterialChangeOption
} from '../../applications.types';
import { ValidationErrors } from '@pins/express';

// Name and description
export interface ApplicationsCreateCaseNameBody extends Record<string, string | undefined> {
	title: string;
	description: string;
}
export interface ApplicationsCreateCaseNameProps
	extends CaseCreateProps<ApplicationsCreateCaseNameBody> {}

// Sector
export interface ApplicationsCreateCaseSectorBody extends Record<string, string | undefined> {
	sectorName?: string;
}
export interface ApplicationsCreateCaseSectorProps
	extends CaseCreateProps<ApplicationsCreateCaseSectorBody> {
	sectors: Sector[];
}

export interface ApplicationsCreateCaseStageBody extends Record<string, string | undefined> {
	stage: string;
}
export interface ApplicationsCreateCaseStageProps
	extends CaseCreateProps<ApplicationsCreateCaseStageBody> {
	stages: CaseStage[];
}

// Sub sector
export interface ApplicationsCreateCaseSubSectorBody extends Record<string, string | undefined> {
	subSectorName?: string;
}
export interface ApplicationsCreateCaseSubSectorProps
	extends CaseCreateProps<ApplicationsCreateCaseSubSectorBody> {
	subSectors: Sector[];
}

//Geo Info
export interface ApplicationsCreateCaseGeographicalInformationBody
	extends Record<string, string | undefined> {
	'geographicalInformation.locationDescription'?: string;
	'geographicalInformation.gridReference.easting'?: string;
	'geographicalInformation.gridReference.northing'?: string;
}
export interface ApplicationsCreateCaseGeographicalInformationProps
	extends CaseCreateProps<ApplicationsCreateCaseGeographicalInformationBody> {}

// Regions
export interface ApplicationsCreateCaseRegionsBody extends Record<string, string | undefined> {
	'geographicalInformation.regionNames'?: string[];
}
// this cannot be extendend CaseCreateProps as it's missing the property "values"
export interface ApplicationsCreateCaseRegionsProps {
	allRegions: SelectItem[];
	errors?: ValidationErrors;
	layout?: FormCaseLayout;
}

// Zoom Level
export interface ApplicationsCreateCaseZoomLevelBody extends Record<string, string | undefined> {
	'geographicalInformation.mapZoomLevelName'?: string;
}
export interface ApplicationsCreateCaseZoomLevelProps
	extends CaseCreateProps<ApplicationsCreateCaseZoomLevelBody> {
	zoomLevels: ZoomLevel[];
}

// Team email
export interface ApplicationsCreateCaseTeamEmailBody extends Record<string, string | undefined> {
	caseEmail?: string;
}
export interface ApplicationsCreateCaseTeamEmailProps
	extends CaseCreateProps<ApplicationsCreateCaseTeamEmailBody> {}

// Is material change
export interface ApplicationsCreateCaseIsMaterialChangeBody
	extends Record<string, string | undefined> {
	values?: Array<isMaterialChangeOption>;
}
export interface ApplicationsCreateCaseIsMaterialChangeProps
	extends CaseCreateProps<ApplicationsCreateCaseIsMaterialChangeBody> {}

export interface ApplicationsCreateCaseIsMaterialChangeRes
	extends CaseCreateProps<ApplicationsCreateCaseIsMaterialChangeBody> {
	values?: Array<isMaterialChangeOption>;
}
