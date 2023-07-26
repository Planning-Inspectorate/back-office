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
