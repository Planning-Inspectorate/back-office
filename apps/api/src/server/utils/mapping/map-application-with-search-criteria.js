import { mapApplication } from './map-application.js';
import { mapCaseStatus } from './map-case-status.js';

/**
 * @typedef {import('@pins/applications.api').Api.ApplicationSearchSummary} ApplicationSearchSummary
 */

/**
 *
 * @param {import('@pins/applications.api').Schema.Case} application
 * @returns {ApplicationSearchSummary}
 */
export const mapApplicationWithSearchCriteria = (application) => {
	const applicationData = mapApplication(application, ['id', 'title', 'reference', 'description']);
	const applicationStatus = mapCaseStatus(application.CaseStatus);

	return {
		...applicationData,
		title: application.title ?? '',
		status: applicationStatus.toString()
	};
};
