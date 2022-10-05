import { post } from '../../../lib/request.js';

/** @typedef {import('./applications-search.types.js').ApplicationsSearchResultsBody} ApplicationsSearchResultsBody */
/** @typedef {import('../../applications.types.js').Application} Application */
/** @typedef {import('../../applications.types.js').PaginatedResponse<Application>} PaginatedApplicationsResponse */

/**
 * @param {ApplicationsSearchResultsBody} payload
 * @returns {Promise<PaginatedApplicationsResponse>}
 */
export const searchApplications = async (payload) => {
	return post('applications/search-results', { json: payload });
};
