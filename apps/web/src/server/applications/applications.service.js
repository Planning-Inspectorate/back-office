import { get } from '../lib/request.js';

/** @typedef {import('./applications.types').Case} Case */
/** @typedef {import('./applications.types').DomainType} DomainType */

/**
 * @param {DomainType} domainType
 * @returns {Promise<import('./applications.types').Case[]>}
 */
export const findOpenApplicationsByDomainType = (domainType) => {
	return get(`applications/${domainType}`);
};
