/**
 * @typedef {import('express-session').Session & { caseSectorName?: string }} SessionWithCaseSectorName
 * @typedef {import('express-session').Session & { caseHasNeverBeenResumed?: boolean }} SessionWithCaseHasNeverBeenResumed
 * @typedef {import('express-session').Session & { infoTypes?: string[] }} SessionWithApplicationsCreateApplicantInfoTypes
 * @typedef {import('express-session').Session & { filesNumberOnList?: number }} SessionWithFilesNumberOnList
 * @typedef {import('express-session').Session & { showSuccessBanner?: boolean }} SessionWithSuccessBanner
 * @typedef {import('express-session').Session & { documentNameOnDeletion?: string }} SessionWithDocumentNameOnDeletion
 */

// Applicant session management

/**
 * Save in the session the applicant organisation name.
 *
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 */
export const setSessionApplicantOrganisationName = (session) => {
	session.infoTypes = ['applicant-organisation-name'];
};

/**
 * Save in the session the list of information types to be provided in the create-new-applicant form.
 *
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 * @param {string[]} infoTypes
 * @returns {void}
 */
export const setSessionApplicantInfoTypes = (session, infoTypes) => {
	session.infoTypes = ['applicant-organisation-name', 'applicant-information-types', ...infoTypes];
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

// Applications session management

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

// Files list

/**
 * Save in the session whether is the first time filling the form or it has been resumed.
 *
 * @param {SessionWithFilesNumberOnList} session
 * @param {number} newFilesNumberOnList
 * @returns {void}
 */
export const setSessionFilesNumberOnList = (session, newFilesNumberOnList) => {
	session.filesNumberOnList = newFilesNumberOnList;
};

/**
 * Retrieve the session info about the form being resumed or not.
 *
 * @param {SessionWithFilesNumberOnList} session
 * @returns {number|undefined}
 */
export const getSessionFilesNumberOnList = (session) => {
	return session.filesNumberOnList;
};

/**
 * Save in the session whether is the first time filling the form or it has been resumed.
 *
 * @param {SessionWithSuccessBanner} session
 * @returns {void}
 */
export const setSuccessBanner = (session) => {
	session.showSuccessBanner = true;
};

/**
 * Get session
 *
 * @param {SessionWithSuccessBanner} session
 * @returns {boolean|undefined}
 */
export const getSuccessBanner = (session) => {
	return session.showSuccessBanner;
};

/**
 * Destroy session info when form gets resumed.
 *
 * @param {SessionWithSuccessBanner} session
 * @returns {void}
 */
export const destroySuccessBanner = (session) => {
	delete session.showSuccessBanner;
};

/**
 * Session data is used for the success banner on the project updates page and overview page
 * It is deleted once read, as it only applies once
 *
 * @typedef {import('express-session').Session & { banner?: string }} BannerSession
 */

/**
 * Get the banner for the user from the session.
 *
 * @param {BannerSession} session
 * @returns {string|undefined}
 */
export function getSessionBanner(session) {
	return session.banner;
}

/**
 * Set the banner for the user in the session.
 *
 * @param {BannerSession} session
 * @param {string} banner
 * @returns {void}
 */
export function setSessionBanner(session, banner) {
	session.banner = banner;
}

/**
 * Delete the banner for the user from the session.
 *
 * @param {BannerSession} session
 * @returns
 */
export function deleteSessionBanner(session) {
	delete session.banner;
}

// Renaming documents on deletion

/**
 * Set the document name to be used when deleting a document in the session.
 * @param {SessionWithDocumentNameOnDeletion} session
 * @param {string} documentNameOnDeletion
 * @returns {void}
 */
export function setSessionDocumentNameOnDeletion(session, documentNameOnDeletion) {
	session.documentNameOnDeletion = documentNameOnDeletion;
}

/**
 * Get the document name to be used when deleting a document from the session.
 * @param {SessionWithDocumentNameOnDeletion} session
 * @returns {string|undefined}
 */
export function getSessionDocumentNameOnDeletion(session) {
	return session.documentNameOnDeletion;
}

/**
 * Delete the document name from the session.
 * @param {SessionWithDocumentNameOnDeletion} session
 * @returns {void}
 */
export function deleteSessionDocumentNameOnDeletion(session) {
	delete session.documentNameOnDeletion;
}
