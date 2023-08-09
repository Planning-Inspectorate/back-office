import got from 'got';
import querystring from 'querystring';

/**
 * Simple API Client for interacting with the back office
 */
export class BackOfficeApiClient {
	/**
	 * @param {string} apiHost
	 */
	constructor(apiHost) {
		this.baseUrl = `https://${apiHost}`;
	}

	/**
	 * Get project updates from the API
	 *
	 * @param {number} id
	 * @returns {Promise<import('@pins/applications').ProjectUpdate>}
	 */
	getProjectUpdate(id) {
		return got.get(`${this.baseUrl}/applications/project-updates/${id}`).json();
	}

	/**
	 * Get project updates from the API
	 *
	 * @param {number} page
	 * @param {number} pageSize
	 * @param {Object} filters
	 * @param {string} [filters.caseReference]
	 * @param {string} [filters.type]
	 * @returns {Promise<import('./types.js').PageResponse<import('@pins/applications').Subscription>>}
	 */
	getSubscriptions(page, pageSize, { caseReference, type }) {
		/** @type {querystring.ParsedUrlQueryInput} */
		const queryInput = {
			page,
			pageSize
		};
		if (caseReference) {
			queryInput.caseReference = caseReference;
		}
		if (type) {
			queryInput.type = type;
		}
		const query = querystring.stringify(queryInput);
		return got.get(`${this.baseUrl}/applications/subscriptions/list/?${query}`).json();
	}
}
