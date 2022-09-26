import { get } from '../lib/request.js';

/** @typedef {import('./applications.types').Application} Application */
/** @typedef {import('./applications.types').DomainType} DomainType */

/**
 * @param {number} id
 * @returns {Promise<Application>}
 */
export const findApplicationById = (id) => {
	return get(`applications/${id}`);
};

/**
 * @param {DomainType} domainType
 * @returns {Promise<import('./applications.types').Application[]>}
 */
export const findOpenApplicationsByDomainType = (domainType) => {
	return get(`applications/${domainType}`);
};
