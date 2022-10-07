import { get, patch, post } from '../../lib/request.js';

/**
 * @typedef {import('../applications.types.js').Application} Application
 * @typedef {import('express-session').Session & { caseSectorName?: string }} SessionWithCaseSectorName
 * @typedef {import('express-session').Session & { caseHasNeverBeenResumed?: boolean }} SessionWithCaseHasNeverBeenResumed
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
 * @param {SessionWithCaseSectorName|null} session
 * @param {Function|null} callback
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const createApplication = async (payload, session = null, callback = null) => {
	const payloadWithEmptyApplicant = { ...payload, applicants: [{ organisationName: '' }] };

	let response;

	try {
		response = await post('applications', {
			json: payloadWithEmptyApplicant
		});
		if (callback) callback(session);
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

// Application session management

/**
 * Save in the session the list of information types to be provided in the create-new-applicant form.
 *
 * @param {SessionWithCaseSectorName} session
 * @param {string|undefined} selectedCaseSectorName
 * @returns {void}
 */
export const setSessionCaseSectorName = (session, selectedCaseSectorName) => {
	session.caseSectorName = selectedCaseSectorName;
};

/**
 * Retrieve the applicant information types from the session.
 *
 * @param {SessionWithCaseSectorName} session
 * @returns {string|undefined}
 */
export const getSessionCaseSectorName = (session) => {
	return session.caseSectorName;
};

/**
 * Clear the case sector from the session.
 *
 * @param {SessionWithCaseSectorName} session
 * @returns {void}
 */
export const destroySessionCaseSectorName = (session) => {
	delete session.caseSectorName;
};

/**
 * Save in the session whether is the first time filling the form or it has been resumed.
 *
 * @param {SessionWithCaseHasNeverBeenResumed} session
 * @returns {void}
 */
export const setSessionCaseHasNeverBeenResumed = (session) => {
	session.caseHasNeverBeenResumed = true;
};

/**
 * Retrieve the session info about the form being resumed or not.
 *
 * @param {SessionWithCaseHasNeverBeenResumed} session
 * @returns {boolean|undefined}
 */
export const getSessionCaseHasNeverBeenResumed = (session) => {
	return session.caseHasNeverBeenResumed;
};

/**
 * Destroy session info when form gets resumed.
 *
 * @param {SessionWithCaseHasNeverBeenResumed} session
 * @returns {void}
 */
export const destroySessionCaseHasNeverBeenResumed = (session) => {
	delete session.caseHasNeverBeenResumed;
};
