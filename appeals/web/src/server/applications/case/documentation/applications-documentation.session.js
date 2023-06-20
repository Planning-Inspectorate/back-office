/**
 * @typedef {import('express-session').Session & { folderPage?: string }} SessionWithFolderPage
 */

/**
 * Get the case-officer state from the session.
 *
 * @param {SessionWithFolderPage} session
 * @returns {string | null}
 */
export const getSessionFolderPage = (session) => session.folderPage || null;

/**
 * @param {SessionWithFolderPage} session
 * @returns {void}
 */
export const destroySessionFolderPage = (session) => {
	delete session.folderPage;
};

/**
 * Set the reviewed questionnaire data after completing a review.
 *
 * @param {SessionWithFolderPage} session
 * @param {string} folderPage
 * @returns {void}
 */
export const setSessionFolderPage = (session, folderPage) => {
	session.folderPage = folderPage;
};
