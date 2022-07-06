import { get } from '../lib/request.js';

/** @typedef {import('./applications.types').Application} Application */

/**
 * @param {number} id
 * @returns {Promise<Application>}
 */
export const findApplicationById = (id) => {
	return get(`applications/application/${id}`);
};

/**
 * @returns {Promise<import('./applications.types').Application[]>}
 */
export const findOpenApplicationsForCaseOfficer = () => {
	return get('applications/case-officer');
};

/**
 * @returns {Promise<import('./applications.types').Application[]>}
 */
export const findOpenApplicationsForCaseAdminOfficer = () => {
	return get('applications/case-admin-officer');
};

/**
 * @returns {Promise<import('./applications.types').Application[]>}
 */
export const findOpenApplicationsForInspector = () => {
	return get('applications/inspector');
};
