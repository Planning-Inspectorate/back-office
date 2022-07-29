/**
 * @typedef {import('express-session').Session & { caseSectorName?: string }} SessionWithCaseSectorName
 */

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
