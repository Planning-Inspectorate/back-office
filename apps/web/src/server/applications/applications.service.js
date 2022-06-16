import { get } from '../lib/request.js';

/** @typedef {import('./applications.types').Application} Application */
/** @typedef {import('./applications.types').ApplicationSummary} ApplicationSummary */

/**
 * @param {number} id
 * @returns {Promise<Application>}
 */
export const findApplicationById = (id) => {
	return get(`applications/application/${id}`);
};

/**
 * @returns {Promise<import('./applications.types').ApplicationSummary[]>}
 */
export const findOpenApplicationsForCaseOfficer = () => {
	return get('applications/case-officer');
};

/**
 * @returns {Promise<import('./applications.types').ApplicationSummary[]>}
 */
export const findOpenApplicationsForCaseAdminOfficer = () => {
	return get('applications/case-admin-officer');
};

/**
 * @returns {Promise<import('./applications.types').ApplicationSummary[]>}
 */
export const findOpenApplicationsForInspector = () => {
	return get('applications/inspector');
};
