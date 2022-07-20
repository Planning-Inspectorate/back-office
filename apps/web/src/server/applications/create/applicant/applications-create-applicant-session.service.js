/**
 * @typedef {import('express-session').Session & { infoTypes?: string[] }} SessionWithApplicationsCreateApplicantInfoTypes
 * @typedef {import('express-session').Session & { applicantId?: string }} SessionWithApplicationsCreateApplicantId
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
 * Save in the session the applicant id.
 *
 * @param {SessionWithApplicationsCreateApplicantId} session
 * @param {string} applicantId
 * @returns {void}
 */
export const setSessionApplicantId = (session, applicantId) => {
	session.applicantId = applicantId;
};

/**
 * Retrieve the applicant id;
 *
 * @param {SessionWithApplicationsCreateApplicantId} session
 * @returns {string|undefined}
 */
export const getSessionApplicantId = (session) => {
	return session.applicantId;
};

/**
 * Clear the applicant id from the session.
 *
 * @param {SessionWithApplicationsCreateApplicantId} session
 * @returns {void}
 */
export const destroySessionApplicantId = (session) => {
	if (session.applicantId) {
		delete session.applicantId;
	}
};
