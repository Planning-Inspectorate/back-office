/**
 * @typedef {import('./applications.types').DomainType} DomainType
 * @typedef {import('express-session').Session & { applicationsDomainType?: DomainType, redirectBackTo?: string }} BOASession
 */

/**
 * Set the domainType of the user in the session.
 *
 * @param {BOASession} session
 * @param {DomainType} domainType
 * @returns {void}
 */
export const setSessionApplicationsDomainType = (session, domainType) => {
	session.applicationsDomainType = domainType;
};

/**
 * Get the domainType of the user from the session.
 *
 * @param {BOASession} session
 * @returns {DomainType|null}
 */
export const getSessionApplicationsDomainType = (session) => {
	return session.applicationsDomainType ?? null;
};

/**
 * Set the redirectBackTo for the session.
 *
 * @param {BOASession} session
 * @param {string} redirectBackTo
 * @returns {void}
 */
export const setSessionApplicationsReferBackTo = (session, redirectBackTo) => {
	session.redirectBackTo = redirectBackTo;
};

/**
 * Get the redirectBackTo from the session.
 *
 * @param {BOASession} session
 * @returns {string|null}
 */
export const getSessionApplicationsReferBackTo = (session) => {
	return session.redirectBackTo ?? null;
};

/**
 * Deletes the redirectBackTo from the session.
 *
 * @param {BOASession} session
 */
export const destroySessionApplicationsReferBackTo = (session) => {
	delete session.redirectBackTo;
};
