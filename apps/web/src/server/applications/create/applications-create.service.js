import { get, patch, post } from '../../lib/request.js';
import { destroySessionApplicantInfoTypes } from './applicant/applications-create-applicant-session.service.js';
import {
	destroySessionCaseSectorName,
	setSessionCaseHasNeverBeenResumed
} from './case/applications-create-case-session.service.js';

/** @typedef {import('./case/applications-create-case-session.service.js').SessionWithCaseSectorName} SessionWithCaseSectorName */
/** @typedef {import('../applications.types').Application} Application */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 *
 * Update application draft and return id and applicant ids if success or errors if fail
 *
 * @param {string} applicationId
 * @param {Record<string, *>} payload
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const updateApplicationDraft = async (applicationId, payload) => {
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

/**
 * Create new draft application and return id and applicant ids
 *
 * @param {Record<string, *>} payload
 * @param {SessionWithCaseSectorName} session
 * @returns {Promise<{id?: number, applicantIds?: Array<number>, errors?: ValidationErrors}>}
 */
export const createApplicationDraft = async (payload, session) => {
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
 * Get draft application by id
 *
 * @param {number} id
 * @returns {Promise<Application>}
 */
export const getApplicationDraft = async (id) => {
	return get(`applications/${id}`);
};
