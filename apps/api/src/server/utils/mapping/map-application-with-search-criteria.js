import { mapApplication } from './map-application.js';
import { mapCaseStatus } from './map-case-status.js';

/**
 * @typedef {{id: number, reference: string, modifiedDate: number, title: string, description: string, status: string, publishedDate?}} ApplicationWithSearchCriteriaResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Case} application
 * @returns {ApplicationWithSearchCriteriaResponse}
 */
export const mapApplicationWithSearchCriteria = (application) => {
	const applicationData = mapApplication(application);
	const applicationStatus = mapCaseStatus(application.CaseStatus);

	return {
		...applicationData,
		title: application.title,
		status: applicationStatus,
		publishedDate: application.publishedAt
	};
};
