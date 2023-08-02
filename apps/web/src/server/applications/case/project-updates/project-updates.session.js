/**
 * Session data is used for the success banner on the project updates page
 * It is deleted once read, as it only applies once
 *
 * @typedef {import('express-session').Session & { banner?: string }} ProjectUpdateSession
 */

/**
 * Get the banner for the user from the session.
 *
 * @param {ProjectUpdateSession} session
 * @returns {string|undefined}
 */
export function getSessionBanner(session) {
	return session.banner;
}

/**
 * Set the banner for the user in the session.
 *
 * @param {ProjectUpdateSession} session
 * @param {string} banner
 * @returns {void}
 */
export function setSessionBanner(session, banner) {
	session.banner = banner;
}

/**
 * Delete the banner for the user from the session.
 *
 * @param {ProjectUpdateSession} session
 * @returns
 */
export function deleteSessionBanner(session) {
	delete session.banner;
}
