import { get, patch, post } from '../../lib/request.js';
import { setSessionApplicantId } from './applicant/applications-create-applicant-session.service.js';

/** @typedef {import('./applicant/applications-create-applicant-session.service.js').SessionWithApplicationsCreateApplicantId} SessionWithApplicationsCreateApplicantId */
/** @typedef {import('../applications.types').Application} Application */

/**
 *
 * Update application draft and return id and applicant ids if success or errors if fail
 *
 * @param {string} applicationId
 * @param {any} payload
 * @returns {Promise<{id: number, applicantIds: Array<number>, errors?: any}>}
 */
export const updateApplicationDraft = async (applicationId, payload) => {
	let response;

	try {
		response = await patch(`applications/${applicationId}`, {
			json: payload
		});
	} catch (/** @type {*} */ error) {
		response = new Promise((resolve) => {
			resolve({ errors: error?.response?.body?.errors });
		});
	}

	return response;
};

/**
 * Create new draft application and return id and applicant ids
 *
 * @param {{title: string, description: string}} payload
 * @param {SessionWithApplicationsCreateApplicantId} session
 * @returns {Promise<{id: number, applicantIds: Array<number>}>}
 */
export const createApplicationDraft = async (payload, session) => {
	const newApplication = await post('applications', {
		json: payload
	});

	setSessionApplicantId(session, newApplication.applicantIds[0]);
	// console.log('newApplication.applicantIds[0]', newApplication.applicantIds[0])
	return newApplication;
};

/**
 * // TODO: this is just a mock.
 *
 * @param {string} id
 * @returns {Promise<Application>}
 */
export const getApplicationDraft = async (id = '') => {
	const allApps = /** @type {Array<Application>} */ await get(`applications/case-officer`);
	const myApp = allApps.find((/** @type {Application} */ app) => `${app.id}` === `${id}`);

	return myApp;
};
