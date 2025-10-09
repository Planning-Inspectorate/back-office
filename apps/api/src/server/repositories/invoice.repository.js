import { databaseConnector } from '#utils/database-connector.js';

/**
 *
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
 *
 * @param {string} invoiceNumber
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice | null>}
 */
export const getInvoiceById = (invoiceNumber) => {
	return databaseConnector.invoice.findUnique({
		where: { invoiceNumber }
	});
};

/**
 *
 * @param {string} invoiceNumber
 * @param {Omit<Partial<import('@pins/applications.api').Schema.Invoice>, 'invoiceNumber'> & { caseId: number }} data
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice>}
 */
export const updateInvoiceById = (invoiceNumber, data) => {
	const { caseId, ...rest } = data;
	return databaseConnector.invoice.upsert({
		where: { invoiceNumber },
		create: {
			invoiceNumber,
			caseId,
			...rest
		},
		update: {
			...rest
		}
	});
};

/**
 *
 * @param {string} invoiceNumber
 * @returns {Promise<import('@pins/applications.api').Schema.Invoice>}
 */
export const deleteInvoiceById = (invoiceNumber) => {
	return databaseConnector.invoice.delete({
		where: { invoiceNumber }
	});
};
