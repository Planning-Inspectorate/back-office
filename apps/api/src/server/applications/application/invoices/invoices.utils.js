/**
 * Converts decimal object to string and truncates to two decimal places
 *
 * @param rawAmount
 * @returns {string|*}
 */
export const formatAmount = (rawAmount) => (!rawAmount ? rawAmount : rawAmount.toFixed(2));

/**
 * Applies formatting to individual invoice
 *
 * @param invoice
 * @returns {object|*}
 */
export const formatInvoiceAmounts = (invoice) => {
	if (!invoice) return invoice;
	return {
		...invoice,
		amountDue: formatAmount(invoice.amountDue),
		refundAmount: formatAmount(invoice.refundAmount)
	};
};

/**
 * Applies formatting to invoices array
 *
 * @param invoices
 * @returns {array|*}
 */
export const formatInvoicesAmounts = (invoices) => {
	if (!invoices || !invoices.length) return invoices;
	return invoices.map((invoice) => formatInvoiceAmounts(invoice));
};
