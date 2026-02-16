import {
	getInvoicesForCase,
	getInvoiceForCaseById,
	createOrUpdateInvoiceForCase,
	deleteInvoiceForCase,
	getInvoicesWithCreditNoteNumber
} from './invoices.service.js';
import BackOfficeAppError from '../../../utils/app-error.js';

/**
 * Gets all invoices for a case by case Id
 *
 * @type {import('express').RequestHandler<{id:number}>}
 */
export const getAllCaseInvoicesController = async ({ params }, res) => {
	const { id: caseId } = params;

	const invoices = await getInvoicesForCase(caseId);

	if (!invoices || invoices.length === 0) {
		return res.send([]);
	}

	return res.send(invoices);
};

/**
 * Gets a single invoice by invoice Id
 *
 * @type {import('express').RequestHandler<{invoiceId:number}>}
 */
export const getCaseInvoiceController = async ({ params }, res) => {
	const { invoiceId } = params;

	const invoice = await getInvoiceForCaseById(invoiceId);

	if (!invoice) {
		throw new BackOfficeAppError(`Invoice ${invoiceId} not found`, 404);
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

	if (body.refundCreditNoteNumber) {
		const creditNoteExists = await getInvoicesWithCreditNoteNumber(body.refundCreditNoteNumber);
		if (creditNoteExists && creditNoteExists.invoiceNumber != body.invoiceNumber) {
			throw new BackOfficeAppError(
				'An invoice with this refund credit note number already exists',
				400
			);
		}
	}

	try {
		const invoice = await createOrUpdateInvoiceForCase(caseId, invoiceId, body);

		return res.status(isCreateRequest ? 201 : 200).send(invoice);
	} catch (error) {
		// Unique constraint violation error (duplicate invoice number or refund credit note number)
		if (error?.code === 'P2002') {
			throw new BackOfficeAppError('An invoice with this invoice number already exists', 400);
		}
		if (error?.code === 'P2025') {
			throw new BackOfficeAppError(`Invoice ${invoiceId} not found`, 404);
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
			throw new BackOfficeAppError(`Invoice ${invoiceId} not found`, 404);
		}
	}
};
