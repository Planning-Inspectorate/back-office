import { databaseConnector } from '#utils/database-connector.js';

/**
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice[]>}
 */
export const getInvoicesByCase = (caseId) => {
	return databaseConnector.invoice.findMany({
		where: { caseId },
		orderBy: { createdAt: 'asc' }
	});
};

/**
 * @param {string} invoiceNumber
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice | null>}
 */
export const getInvoiceById = (invoiceNumber) => {
	return databaseConnector.invoice.findUnique({
		where: { invoiceNumber }
	});
};

/**
 * @param {string} invoiceNumber
 * @param {number} caseId
 * @param {string} invoiceStage
 * @param {decimal} amountDue
 * @param {DateTime} paymentDueDate
 * @param {DateTime} invoicedDate
 * @param {DateTime} paymentDate
 * @param {string} refundCreditNoteNumber
 * @param {decimal} refundAmount
 * @param {DateTime} refundIssueDate
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice>}
 */
export const updateInvoiceById = (
	invoiceNumber,
	caseId,
	invoiceStage,
	amountDue,
	paymentDueDate,
	invoicedDate,
	paymentDate,
	refundCreditNoteNumber,
	refundAmount,
	refundIssueDate
) => {
	return databaseConnector.invoice.upsert({
		where: { invoiceNumber },
		create: {
			invoiceNumber,
			caseId,
			invoiceStage,
			amountDue,
			paymentDueDate,
			invoicedDate,
			paymentDate,
			refundCreditNoteNumber,
			refundAmount,
			refundIssueDate
		},
		update: {
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
 * @param {string} invoiceNumber
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice>}
 */
export const deleteInvoiceById = (invoiceNumber) => {
	return databaseConnector.invoice.delete({
		where: { invoiceNumber }
	});
};
