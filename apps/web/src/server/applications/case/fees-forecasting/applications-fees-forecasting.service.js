import { get } from '../../../lib/request.js';

/**
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export async function getInvoices(caseId) {
	return get(`applications/${caseId}/invoices`);
}
