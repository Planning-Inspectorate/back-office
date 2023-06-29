import { mapApplication } from './map-application.js';
import { mapCaseStatus } from './map-case-status.js';

/**
 * @typedef {{id: number, reference: string | null, title: string | null, description: string, status: string | object}} ApplicationWithSearchCriteriaResponse
 */

/**
 *
 * @param {import('@pins/applications.api').Schema.Case} application
 * @returns {ApplicationWithSearchCriteriaResponse}
 */
export const mapApplicationWithSearchCriteria = (application) => {
	const applicationData = mapApplication(application, ['id', 'title', 'reference', 'description']);
	const applicationStatus = mapCaseStatus(application.CaseStatus);

	return {
		...applicationData,
		title: application.title,
		status: applicationStatus
	};
};
