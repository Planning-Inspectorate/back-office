import { fixtureApplications } from '../../../../testing/applications/fixtures/applications.js';

/** @typedef {import('./applications-search.types').ApplicationsSearchResultsBody} ApplicationsSearchResultsBody */
/** @typedef {import('../applications.types').Application} Application */
/** @typedef {import('../applications.types').PaginatedResponse<Application>} PaginatedApplicationsResponse */

/**
 * @param {ApplicationsSearchResultsBody} payload
 * @returns {Promise<PaginatedApplicationsResponse>}
 */
export const searchApplications = (payload) => {
	const mockResponse = {
		page: payload.pageNumber,
		pageSize: payload.pageSize,
		pageCount: 1,
		itemCount: 2,
		items: fixtureApplications
	};

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockResponse);
		}, 1000);
	});

	// return post('applications/search', {body});
};
