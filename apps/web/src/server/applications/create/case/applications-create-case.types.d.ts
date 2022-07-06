import { Region, Sector, ZoomLevel } from '../../applications.types';
import { ValidationErrors } from '@pins/express';

export type ApplicationsCreateCaseNameProps = {
	applicationName?: string;
	applicationDescription?: string;
	errors?: ValidationErrors;
};

export type ApplicationsCreateCaseNameBody = {
	applicationName: string;
	applicationDescription: string;
};

export type ApplicationsCreateCaseSectorProps = {
	sectors: Sector[];
	selectedValue?: string;
	errors?: ValidationErrors;
};

export type ApplicationsCreateCaseSectorBody = {
	selectedSectorName: string;
};

export type ApplicationsCreateCaseSubSectorProps = {
	subSectors: Sector[];
	selectedValue?: string;
	errors?: ValidationErrors;
};

export type ApplicationsCreateCaseSubSectorBody = {
	selectedSubSectorName: string;
};

export type ApplicationsCreateCaseGeographicalInformationProps = {
	applicationLocation?: string;
	applicationEasting?: string;
	applicationNorthing?: string;
	errors?: ValidationErrors;
};

export type ApplicationsCreateCaseGeographicalInformationBody = {
	applicationLocation: string;
	applicationEasting: string;
	applicationNorthing: string;
};

export type ApplicationsCreateCaseRegionsProps = {
	regions: Region[];
	errors?: ValidationErrors;
};

export type ApplicationsCreateCaseRegionsBody = {
	selectedRegionsNames: string[];
};
export type ApplicationsCreateCaseZoomLevelProps = {
	zoomLevels: ZoomLevel[];
	errors?: ValidationErrors;
};

export type ApplicationsCreateCaseZoomLevelBody = {
	selectedZoomLevelName: string;
};

export type ApplicationsCreateCaseTeamEmailProps = {
	applicationTeamEmail: string;
	errors?: ValidationErrors;
};

export type ApplicationsCreateCaseTeamEmailBody = {
	applicationTeamEmail: string;
};

export type UpdateOrCreateCallback = () => Promise<{
	errors?: ValidationErrors;
	id?: string;
}>;
