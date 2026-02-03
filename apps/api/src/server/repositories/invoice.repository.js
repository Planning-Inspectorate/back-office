import { databaseConnector } from '#utils/database-connector.js';

/**
 * @typedef { import('@pins/applications.api').Schema.InvoiceCreateOrUpdateRequest } createOrUpdateInvoiceData
 */

/**
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice[]>}
 */
export const getInvoicesByCaseId = (caseId) => {
	return databaseConnector.invoice.findMany({
		where: { caseId },
		orderBy: { createdAt: 'asc' }
	});
};

/**
 * @param {number} invoiceId
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice | null>}
 */
export const getInvoiceById = (invoiceId) => {
	return databaseConnector.invoice.findFirst({
		where: {
			id: invoiceId
		}
	});
};

/**
 * @param refundCreditNoteNumber
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice | null>}
 */
export const getInvoiceByCreditNoteNumber = (refundCreditNoteNumber) => {
	return databaseConnector.invoice.findFirst({
		where: {
			refundCreditNoteNumber
		}
	});
};

/**
 *@param {number} caseId
 * @param {createOrUpdateInvoiceData} createOrUpdateInvoiceData
 * @returns{Promise<import('@pins/applications.api').Schema.Invoice>}
 */
export const createInvoiceById = (caseId, createOrUpdateInvoiceData) => {
	const {
		invoiceNumber,
		invoiceStage,
		amountDue,
		paymentDueDate,
		invoicedDate,
		paymentDate,
		refundCreditNoteNumber,
		refundAmount,
		refundIssueDate
	} = createOrUpdateInvoiceData;

	return databaseConnector.invoice.create({
		data: {
			caseId,
			invoiceNumber,
			invoiceStage,
			amountDue,
			paymentDueDate,
			invoicedDate,
			paymentDate,
			refundCreditNoteNumber,
			refundAmount,
			refundIssueDate
		}
	});
};

/**
 * @param {number} invoiceId
 * @param {createOrUpdateInvoiceData} createOrUpdateInvoiceData
 * @returns{Promise<import('@pins/applications.api').Schema.Invoice>}
 */
export const updateInvoiceById = (invoiceId, createOrUpdateInvoiceData) => {
	const {
		invoiceNumber,
		invoiceStage,
		amountDue,
		paymentDueDate,
		invoicedDate,
		paymentDate,
		refundCreditNoteNumber,
		refundAmount,
		refundIssueDate
	} = createOrUpdateInvoiceData;

	return databaseConnector.invoice.update({
		where: { id: invoiceId },
		data: {
			invoiceNumber,
			invoiceStage,
			amountDue,
			paymentDueDate,
			invoicedDate,
			paymentDate,
			refundCreditNoteNumber,
			refundAmount,
			refundIssueDate
		}
	});
};

/**
 * @param {number} invoiceId
 * @returns {Promise<void|null>}
 */
export const deleteInvoiceById = (invoiceId) => {
	return databaseConnector.invoice.delete({
		where: {
			id: invoiceId
		}
	});
};
