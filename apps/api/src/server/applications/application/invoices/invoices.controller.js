import {
	getInvoicesForCase,
	getInvoiceForCaseById,
	createOrUpdateInvoiceForCase,
	deleteInvoiceForCase
} from './invoices.service.js';

/**
 * Gets all invoices for a case by case Id
 *
 * @type {import('express').RequestHandler<{id:number}>}
 */
export const getAllCaseInvoicesController = async ({ params }, res) => {
	const { id: caseId } = params;

	const invoices = await getInvoicesForCase(caseId);

	if (!invoices || invoices.length === 0) {
		return res.status(404).json({
			errors: { invoices: `No invoices found for case ${caseId}` }
		});
	}

	return res.send(invoices);
};

/**
 * Gets a single invoice by invoice Id and case Id
 *
 * @type {import('express').RequestHandler<{id:number, invoiceId:number}>}
 */
export const getCaseInvoiceController = async ({ params }, res) => {
	const { invoiceId } = params;

	const invoice = await getInvoiceForCaseById(invoiceId);

	if (!invoice) {
		return res.status(404).json({
			errors: { invoice: `Invoice ${invoiceId} not found` }
		});
	}
	return res.send(invoice);
};

/**
 * Create or update an existing invoice for a given case
 *
 * @type {import('express').RequestHandler<{id:number, invoiceId:number}, {}, Partial<import('@pins/applications.api').Schema.InvoiceUpdateRequest>>}
 */
export const createOrUpdateInvoiceController = async ({ params, body }, res) => {
	const { id: caseId, invoiceId } = params;
	const isCreateRequest = invoiceId === null || invoiceId === undefined;

	try {
		const invoice = await createOrUpdateInvoiceForCase(caseId, invoiceId, body);

		return res.status(isCreateRequest ? 201 : 200).send(invoice);
	} catch (error) {
		if (error?.code === 'P2002') {
			return res.status(400).json({
				errors: { invoice: 'An invoice with this invoice number already exists' }
			});
		}
		if (error?.code === 'P2025') {
			return res.status(404).json({
				errors: { invoice: `Invoice ${invoiceId} not found` }
			});
		}
	}
};

/**
 * Delete invoice for a given case
 *
 * @type {import('express').RequestHandler<{id:number, invoiceId:number}>}
 */
export const deleteInvoiceController = async ({ params }, res) => {
	const { invoiceId } = params;

	try {
		await deleteInvoiceForCase(invoiceId);
		return res.status(204).send();
	} catch (error) {
		if (error?.code === 'P2025') {
			return res.status(404).json({
				errors: { invoice: `Invoice ${invoiceId} not found` }
			});
		}
	}
};
