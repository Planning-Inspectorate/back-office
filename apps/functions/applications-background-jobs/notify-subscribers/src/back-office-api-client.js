import { HTTPError } from 'got';
import { requestWithApiKey } from '../../common/backend-api-request.js';

/**
 * Simple API Client for interacting with the back office
 */
export class BackOfficeApiClient {
	/**
	 * @param {string} apiHost
	 */
	constructor(apiHost) {
		// if the api host is just the domain, append https://
		if (!apiHost.startsWith('http')) {
			apiHost = 'https://' + apiHost;
		}
		this.baseUrl = apiHost;
	}

	/**
	 * Get project updates from the API, or null if not found
	 *
	 * @param {number} id
	 * @returns {Promise<import('@pins/applications').ProjectUpdate|null>}
	 */
	async getProjectUpdate(id) {
		try {
			return await requestWithApiKey
				.get(`${this.baseUrl}/applications/project-updates/${id}`)
				.json();
		} catch (e) {
			if (e instanceof HTTPError) {
				if (e.response.statusCode === 404) {
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Get project updates from the API and extend with additional application data, or null if not found
	 *
	 * @param {string} caseReference
	 * @param {number} id
	 * @returns {Promise<import('./types.js').ExtendedProjectUpdate|null>}
	 */
	async getExtendedProjectUpdate(caseReference, id) {
		try {
			const applicationDataPromise = requestWithApiKey
				.get(`${this.baseUrl}/applications/${caseReference}`)
				.json();

			const updateDataPromise = requestWithApiKey
				.get(`${this.baseUrl}/applications/project-updates/${id}`)
				.json();

			const [updateData, { title: projectName }] = await Promise.all([updateDataPromise, applicationDataPromise])

			return {
				...updateData,
				projectName
			}
		} catch (e) {
			if (e instanceof HTTPError) {
				if (e.response.statusCode === 404) {
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Patch a project update, to update sentToSubscribers
	 *
	 * @param {number} id
	 * @param {number} caseId
	 * @param {boolean} sentToSubscribers
	 * @returns {Promise<import('@pins/applications').ProjectUpdate>}
	 */
	async patchProjectUpdate(id, caseId, sentToSubscribers) {
		return requestWithApiKey
			.patch(`${this.baseUrl}/applications/${caseId}/project-updates/${id}`, {
				json: { sentToSubscribers }
			})
			.json();
	}

	/**
	 * Get project updates from the API
	 *
	 * @param {number} page
	 * @param {number} pageSize
	 * @param {Object} filters
	 * @param {string} [filters.caseReference]
	 * @param {string} [filters.type]
	 * @param {Date} [filters.endAfter]
	 * @returns {Promise<import('./types.js').PageResponse<import('@pins/applications').Subscription>>}
	 */
	getSubscriptions(page, pageSize, { caseReference, type, endAfter }) {
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
		if (endAfter) {
			queryInput.endAfter = endAfter.toISOString();
		}
		const queryParams = new URLSearchParams(queryInput);
		const query = queryParams.toString();
		return requestWithApiKey
			.get(`${this.baseUrl}/applications/subscriptions/list/?${query}`)
			.json();
	}

	/**
	 * Add notifications logs
	 *
	 * @param {number} projectUpdateId
	 * @param {number} caseId
	 * @param {import('@pins/applications').ProjectUpdateNotificationLogCreateReq[]} logs
	 * @returns {Promise<{count: number}>}
	 */
	postNotificationLogs(projectUpdateId, caseId, logs) {
		return requestWithApiKey
			.post(
				`${this.baseUrl}/applications/${caseId}/project-updates/${projectUpdateId}/notification-logs`,
				{
					json: logs
				}
			)
			.json();
	}
}
