import * as invoicesRepository from '#repositories/invoice.repository.js';
import { formatInvoiceAmounts, formatInvoicesAmounts } from './invoices.utils.js';

// Invoice amounts are stored in the database as decimal values e.g. 4500.5000000000000000
// When retrieved by Prisma they are converted to decimal objects and sometimes contain a small precision error e.g. 4500.5000000002
// We convert invoice amounts to strings in pounds and pence format here e.g. '4500.50' to allow monetary calcuations to be performed in the controller as required

/**
 * Get all invoices for a case by case Id
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice[]>}
 */
export const getInvoicesForCase = async (caseId) => {
	const invoices = await invoicesRepository.getInvoicesByCaseId(Number(caseId));
	return formatInvoicesAmounts(invoices);
};

/**
 * Get a single invoice by invoice Id
 * @param {number} invoiceId
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice|null>}
 */
export const getInvoiceForCaseById = async (invoiceId) => {
	const invoice = await invoicesRepository.getInvoiceById(Number(invoiceId));
	return formatInvoiceAmounts(invoice);
};

/**
 * @param {string} refundCreditNoteNumber
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice|null>}
 */
export const getInvoicesWithCreditNoteNumber = async (refundCreditNoteNumber) => {
	const invoice = await invoicesRepository.getInvoiceByCreditNoteNumber(refundCreditNoteNumber);
	return formatInvoiceAmounts(invoice);
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
