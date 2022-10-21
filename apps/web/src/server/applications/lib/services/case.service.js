import { get, patch, post } from '../../../lib/request.js';
import {
	destroySessionApplicantInfoTypes,
	destroySessionCaseSectorName,
	setSessionCaseHasNeverBeenResumed
} from './session.service.js';

/**
 * @typedef {import('../../applications.types').Case} Case
 * @typedef {import('../../applications.types').DocumentationCategory} DocumentationCategory
 * @typedef {import('express-session').Session & { caseSectorName?: string }} SessionWithCaseSectorName
 * @typedef {import('@pins/express').ValidationErrors} ValidationErrors
 */

/**
 * Get draft Caseby id
 * optional query parameters can filter the returned data
 *
 * @param {number} id
 * @param { string[] | null} query
 * @returns {Promise<Case>}
 */
export const getCase = async (id, query = null) => {
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
 * Create new draft Caseand return id and applicant ids
 *
 * @param {Record<string, *>} payload
 * @param {SessionWithCaseSectorName} session
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const createCase = async (payload, session) => {
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
 * Update Caseand return id and applicant ids if success or errors if fail
 *
 * @param {string} caseId
 * @param {Record<string, *>} payload
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const updateCase = async (caseId, payload) => {
	let response;

	try {
		response = await patch(`applications/${caseId}`, {
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

/**
 * Get documents categories for the case
 *
 * @param {number} id
 * @returns {Promise<DocumentationCategory[]>}
 */
export const getCaseDocumentationCategories = (id) => {
	return get(`applications/${id}/documents`);
};
