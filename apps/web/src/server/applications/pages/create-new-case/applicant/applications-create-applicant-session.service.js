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
