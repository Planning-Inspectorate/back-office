import { post } from '../../lib/request.js';

/** @typedef {import('./applications-search.types.js').ApplicationsSearchResultsBody} ApplicationsSearchResultsBody */
/** @typedef {import('../applications.types').Case} Case */
/** @typedef {import('../applications.types.js').PaginatedResponse<Case>} PaginatedApplicationsResponse */

/**
 * @param {ApplicationsSearchResultsBody} payload
 * @returns {Promise<PaginatedApplicationsResponse>}
 */
export const searchApplications = async (payload) => {
	return post('applications/search', { json: payload });
};
