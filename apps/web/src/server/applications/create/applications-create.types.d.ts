import { Region, Sector } from '../applications.types';
import { ValidationErrors } from '@pins/express';

export type ApplicationsCreateNameProps = {
	applicationName?: string;
	applicationDescription?: string;
	errors?: ValidationErrors;
};

export type ApplicationsCreateNameBody = {
	applicationName: string;
	applicationDescription: string;
};

export type ApplicationsCreateSectorProps = {
	sectors: Sector[];
	selectedValue?: string;
	errors?: ValidationErrors;
};

export type ApplicationsCreateSectorBody = {
	selectedSectorName: string;
};

export type ApplicationsCreateSubSectorProps = {
	subSectors: Sector[];
	selectedValue?: string;
	errors?: ValidationErrors;
};

export type ApplicationsCreateSubSectorBody = {
	selectedSubSectorName: string;
};

export type ApplicationsCreateGeographicalInformationProps = {
	applicationLocation?: string;
	applicationEasting?: string;
	applicationNorthing?: string;
	errors?: ValidationErrors;
};

export type ApplicationsCreateGeographicalInformationBody = {
	applicationLocation: string;
	applicationEasting: string;
	applicationNorthing: string;
};

export type ApplicationsCreateRegionsProps = {
	regions: Region[];
	errors?: ValidationErrors;
};

export type ApplicationsCreateRegionsBody = {
	selectedRegionsNames: string[];
};

export type UpdateOrCreateCallback = () => Promise<{
	errors?: ValidationErrors;
	id?: string;
}>;
