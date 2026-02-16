import * as invoicesRepository from '#repositories/invoice.repository.js';

/**
 * Get all invoices for a case by case Id
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice[]>}
 */
export const getInvoicesForCase = async (caseId) => {
	return invoicesRepository.getInvoicesByCaseId(Number(caseId));
};

/**
 * Get a single invoice by invoice Id
 * @param {number} invoiceId
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice|null>}
 */
export const getInvoiceForCaseById = async (invoiceId) => {
	return invoicesRepository.getInvoiceById(Number(invoiceId));
};

/**
 * @param {string} refundCreditNoteNumber
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice|null>}
 */
export const getInvoicesWithCreditNoteNumber = async (refundCreditNoteNumber) => {
	return invoicesRepository.getInvoiceByCreditNoteNumber(refundCreditNoteNumber);
};

/**
 * Create or update an invoice for a case
 * @param {number} caseId
 * @param {number} invoiceId
 * @param {import('@pins/applications.api').Schema.Invoice} invoiceData
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice>}
 */
export const createOrUpdateInvoiceForCase = async (caseId, invoiceId, invoiceData) => {
	if (invoiceId) {
		return invoicesRepository.updateInvoiceById(Number(invoiceId), invoiceData);
	} else {
		return invoicesRepository.createInvoiceById(Number(caseId), invoiceData);
	}
};

/**
 * Delete an invoice for a case
 * @param {number} invoiceId
 * @returns {Promise<void|null>}
 */
export const deleteInvoiceForCase = async (invoiceId) => {
	return invoicesRepository.deleteInvoiceById(Number(invoiceId));
};
