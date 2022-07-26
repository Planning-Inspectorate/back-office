import { mapApplication } from './map-application.js';
import { mapCaseStatus } from './map-case-status.js';
import { mapSector } from './map-sector.js';

/**
 * @typedef {{name: string, displayNameEn: string, displayNameCy: string, abbreviation: string}} SectorResponse
 * @typedef {{id: number, modifiedDate: number, reference: string, status: string | object, sector: SectorResponse, subSector: SectorResponse}} ApplicationWithSectorResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Case} application
 * @returns {ApplicationWithSectorResponse}
 */
export const mapApplicationWithSectorAndSubSector = (application) => {
	const applicationData = mapApplication(application);

	const applicationStatus = mapCaseStatus(application.CaseStatus);

	const geographicalInformation = {
		locationDescription: application.ApplicationDetails?.locationDescription,
		gridReference: application?.gridReference,
		regions: application.regions,
		mapZoomLevel: application.ApplicationDetails?.zoomLevel
	}

	return {
		...applicationData,
		subSector: mapSector(application.ApplicationDetails?.subSector),
		sector: mapSector(application.ApplicationDetails?.subSector?.sector),
		geographicalInformation,
		status: applicationStatus
	};
};
