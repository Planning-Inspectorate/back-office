import { getApplication } from './application.js';

/** @typedef {import('../applications.types').Applicant} Applicant */

/**
 * Returns the applicant matching id of a draft application
 *
 * @param {number} applicationId
 * @param {number} applicantId
 * @param { string[] | null } query
 * @returns {Promise<Applicant|null>}
 */
export async function getApplicantById(applicationId, applicantId, query = null) {
	const { applicants } = await getApplication(applicationId, query);

	let applicant;

	if (applicants && applicants.length > 0) {
		applicant = applicants.find((apps) => apps.id === applicantId);
	}
	return applicant || null;
}

// Applicant session management

/**
 * @typedef {import('express-session').Session & { infoTypes?: string[] }} SessionWithApplicationsCreateApplicantInfoTypes
 */

/**
 * Save in the session the list of information types to be provided in the create-new-applicant form.
 *
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 * @param {string[]} infoTypes
 * @returns {void}
 */
export const setSessionApplicantInfoTypes = (session, infoTypes) => {
	session.infoTypes = ['applicant-information-types', ...infoTypes];
};

/**
 * Retrieve the applicant information types from the session.
 *
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 * @returns {string[]}
 */
export const getSessionApplicantInfoTypes = (session) => {
	return session.infoTypes ?? [];
};

/**
 * Clear the list of applicant information types
 *
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 * @returns {void}
 */
export const destroySessionApplicantInfoTypes = (session) => {
	delete session.infoTypes;
};
