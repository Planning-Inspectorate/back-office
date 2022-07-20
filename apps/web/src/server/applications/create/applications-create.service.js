import { fixtureApplications } from '../../../../testing/applications/fixtures/applications.js';
import { setSessionApplicantId } from './applicant/applications-create-applicant-session.service.js';

/** @typedef {import('./applicant/applications-create-applicant-session.service.js').SessionWithApplicationsCreateApplicantId} SessionWithApplicationsCreateApplicantId */

/**
 * // TODO: this is just a mock.
 *
 * @param {string} applicationId
 * @param {any} newData
 * @returns {Promise<any>}
 */
export const updateApplicationDraft = async (applicationId, newData) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ id: applicationId, ...newData });
		}, 1000);
	});
};

/**
 * // TODO: this is just a mock.
 *
 * @param {any} payload
 * @param {SessionWithApplicationsCreateApplicantId} session
 * @returns {Promise<any>}
 */
export const createApplicationDraft = async (payload, session) => {
	const mockGet = () =>
		new Promise((resolve) => {
			setTimeout(() => {
				resolve({ ...payload, id: 123, applicantIds: [2] });
			}, 1000);
		});
	const newApplication = await mockGet();

	setSessionApplicantId(session, newApplication.applicantIds[0]);
	return newApplication;
};

/**
 * // TODO: this is just a mock.
 *
 * @param {string} id
 * @returns {Promise<any>}
 */
export const getApplicationDraft = (id = '') => {
	const mockedResponse = id === '123' ? { id: 123 } : fixtureApplications[0];

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockedResponse);
		}, 1000);
	});
};
