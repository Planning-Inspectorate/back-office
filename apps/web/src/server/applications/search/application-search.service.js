import { post } from '../../lib/request.js';

/** @typedef {import('./applications-search.types').ApplicationsSearchResultsBody} ApplicationsSearchResultsBody */
/** @typedef {import('../applications.types').Application} Application */
/** @typedef {import('../applications.types').PaginatedResponse<Application>} PaginatedApplicationsResponse */

/**
 * @param {ApplicationsSearchResultsBody} payload
 * @returns {Promise<PaginatedApplicationsResponse>}
 */
export const searchApplications = async (payload) => {
	return post('applications/search', { json: payload });
};
