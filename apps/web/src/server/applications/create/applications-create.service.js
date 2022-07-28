import { get, patch, post } from '../../lib/request.js';
import { destroySessionCaseSectorName } from './case/applications-create-case-session.service.js';

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
			resolve({ errors: error?.response?.body?.errors || {} });
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
	const payloadWithEmptyApplicant = { ...payload, applicant: { organisationName: '' } };

	let response;

	try {
		response = await post('applications', {
			json: payloadWithEmptyApplicant
		});
		destroySessionCaseSectorName(session);
	} catch (/** @type {*} */ error) {
		response = new Promise((resolve) => {
			resolve({ errors: error?.response?.body?.errors || {} });
		});
	}

	return response;
};

/**
 * // TODO: this is just a mock.
 *
 * @param {string} id
 * @returns {Promise<Application>}
 */
export const getApplicationDraft = async (id = '') => {
	const allApps = /** @type {Array<Application>} */ await get(`applications/case-officer`);

	return allApps.find((/** @type {Application} */ app) => `${app.id}` === `${id}`);
};
