import { mapApplication } from './map-application.js';
import { mapSector } from './map-sector.js';

/**
 * @typedef {{name: string, displayNameEn: string, displayNameCy: string, abbreviation: string}} SectorResponse
 * @typedef {{id: number, modifiedDate: number, reference: string, sector: SectorResponse, subSector: SectorResponse}} ApplicationWithSectorResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Case} application
 * @returns {ApplicationWithSectorResponse}
 */
export const mapApplicationWithSectorAndSubSector = (application) => {
	const applicationData = mapApplication(application);

	return {
		...applicationData,
		subSector: mapSector(application.ApplicationDetails.subSector),
		sector: mapSector(application.ApplicationDetails.subSector.sector)
	};
};
