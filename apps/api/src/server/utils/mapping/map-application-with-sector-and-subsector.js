import { mapApplication } from './map-application.js';
import { mapCaseStatus } from './map-case-status.js';
import { mapSector } from './map-sector.js';

/**
 * @typedef {import('@pins/applications.api').Api.ApplicationSummary} ApplicationSummary
 */

/**
 *
 * @param {import('@pins/applications.api').Schema.Case} application
 * @returns {ApplicationSummary}
 */
export const mapApplicationWithSectorAndSubSector = (application) => {
	const applicationData = mapApplication(application, ['id', 'title', 'reference', 'modifiedAt']);

	const applicationStatus = mapCaseStatus(application.CaseStatus);

	return {
		...applicationData,
		subSector: mapSector(application?.ApplicationDetails?.subSector),
		sector: mapSector(application?.ApplicationDetails?.subSector?.sector) || null,
		status: applicationStatus
	};
};
