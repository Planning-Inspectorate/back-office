import pino from '../../../lib/logger.js';
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
 * Get draft case by id
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

	let response;

	try {
		response = await get(`applications/${id}${query ? `?query=${queryStringified}` : ''}`);
	} catch (/** @type {*} */ error) {
		pino.error(
			`[WEB] GET /applications-service/case/${id} (Response code: ${error?.response?.statusCode})`
		);
		throw new Error(error?.response?.statusCode ?? 500);
	}
	return response;
};

/**
 * Create new draft case and return id and applicant ids
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
 * Update case and return id and applicant ids if success or errors if fail
 *
 * @param {string} caseId
 * @param {Record<string, *>} payload
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const updateCase = async (caseId, payload) => {
	let response;
	console.log('entro qui');
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
 *
 * Publish case with updated changes
 *
 * @param {number} caseId
 * @returns {Promise<{publishedDate?: number, errors?: ValidationErrors}>}
 */
export const publishCase = async (caseId) => {
	let response;

	try {
		response = await patch(`applications/${caseId}/publish`);
	} catch {
		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'Something went wrong, please try again' } });
		});
	}

	return response;
};
