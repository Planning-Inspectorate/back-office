import { get, patch, post } from '../../../lib/request.js';
import {
	destroySessionApplicantInfoTypes,
	destroySessionCaseSectorName,
	setSessionCaseHasNeverBeenResumed
} from './session.service.js';

/**
 * @typedef {import('../../applications.types').Application} Application
 * @typedef {import('express-session').Session & { caseSectorName?: string }} SessionWithCaseSectorName
 */

/**
 * Get draft application by id
 * optional query parameters can filter the returned data
 *
 * @param {number} id
 * @param { string[] | null} query
 * @returns {Promise<Application>}
 */
export const getApplication = async (id, query = null) => {
	let queryObject = {};

	if (query) {
		for (const singleQuery of query) {
			queryObject = { ...queryObject, [singleQuery]: true };
		}
	}

	const queryStringified = JSON.stringify(queryObject);

	return get(`applications/${id}${query ? `?query=${queryStringified}` : ''}`);
};

/**
 * Create new draft application and return id and applicant ids
 *
 * @param {Record<string, *>} payload
 * @param {SessionWithCaseSectorName} session
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const createApplication = async (payload, session) => {
	const payloadWithEmptyApplicant = { ...payload, applicants: [{ organisationName: '' }] };

	let response;

	try {
		response = await post('applications', {
			json: payloadWithEmptyApplicant
		});
		setSessionCaseHasNeverBeenResumed(session);
		destroySessionApplicantInfoTypes(session);
		destroySessionCaseSectorName(session);
	} catch (/** @type {*} */ error) {
		response = new Promise((resolve) => {
			resolve({ errors: error?.response?.body?.errors || {} });
		});
	}

	return response;
};

/**
 *
 * Update application and return id and applicant ids if success or errors if fail
 *
 * @param {string} applicationId
 * @param {Record<string, *>} payload
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const updateApplication = async (applicationId, payload) => {
	let response;

	try {
		response = await patch(`applications/${applicationId}`, {
			json: payload
		});
	} catch (/** @type {*} */ error) {
		response = new Promise((resolve) => {
			const apiErrors = error?.response?.body?.errors;

			if (typeof apiErrors === 'object' && typeof Object.values(apiErrors)[0] === 'string') {
				resolve({ errors: error?.response?.body?.errors || {} });
			} else {
				resolve({ errors: {} });
			}
		});
	}

	return response;
};
