import { get } from '../../../lib/request.js';

/**
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export async function getInvoices(caseId) {
	return get(`applications/${caseId}/invoices`);
}

/**
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export async function getMeetings(caseId) {
	return get(`applications/${caseId}/meetings`);
}
