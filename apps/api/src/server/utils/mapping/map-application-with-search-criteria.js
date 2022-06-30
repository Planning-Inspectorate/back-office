import { mapApplication } from './map-application.js';

/**
 * @typedef {{id: number, reference: string, modifiedDate: number, title: string, description: string, status: string, publishedDate?}} ApplicationWithSearchCriteriaResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Application} application
 * @returns {ApplicationWithSearchCriteriaResponse}
 */
export const mapApplicationWithSearchCriteria = (application) => {
	const applicationData = mapApplication(application);

	return {
		...applicationData,
		title: application.title,
		status: application.status,
		publishedDate: application.publishedAt
	};
};
