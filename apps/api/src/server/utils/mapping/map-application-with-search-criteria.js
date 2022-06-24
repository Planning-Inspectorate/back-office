import { mapApplication } from './map-application.js';

/**
 * @typedef {{id: number, reference: string, title: string, description: string, modifiedDate: number}} ApplicationWithSearchCriteriaResponse
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
		description: application.description
	};
};
