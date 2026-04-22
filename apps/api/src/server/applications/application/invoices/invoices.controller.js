import {
	getInvoicesForCase,
	getInvoiceForCaseById,
	createOrUpdateInvoiceForCase,
	deleteInvoiceForCase,
	getInvoicesWithCreditNoteNumber
} from './invoices.service.js';
import BackOfficeAppError from '../../../utils/app-error.js';
import { mapDateToUnixTimestamp } from '#utils/mapping/map-date-to-unix-timestamp.js';
import * as caseRepository from '#repositories/case.repository.js';
import { broadcastNsipProjectEvent } from '#infrastructure/event-broadcasters.js';
import { EventType } from '@pins/event-client';

const additionalProjectEntities = {
	subSector: true,
	sector: true,
	applicationDetails: true,
	zoomLevel: true,
	regions: true,
	caseStatus: true,
	projectTeam: true,
	gridReference: true,
	invoice: true,
	meeting: true
};

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

	const mappedInvoices = invoices.map((invoice) => ({
		...invoice,
		paymentDueDate: mapDateToUnixTimestamp(invoice.paymentDueDate),
		invoicedDate: mapDateToUnixTimestamp(invoice.invoicedDate),
		paymentDate: mapDateToUnixTimestamp(invoice.paymentDate)
	}));

	return res.send(mappedInvoices);
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

	const mappedInvoice = {
		...invoice,
		paymentDueDate: mapDateToUnixTimestamp(invoice.paymentDueDate),
		invoicedDate: mapDateToUnixTimestamp(invoice.invoicedDate),
		paymentDate: mapDateToUnixTimestamp(invoice.paymentDate),
		amountDue: invoice.amountDue ? Number(invoice.amountDue).toFixed(2) : invoice.amountDue,
		refundAmount: invoice.refundAmount
			? Number(invoice.refundAmount).toFixed(2)
			: invoice.refundAmount
	};

	return res.send(mappedInvoice);
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
		if (creditNoteExists && creditNoteExists.id !== invoiceId) {
			throw new BackOfficeAppError(
				'An invoice with this refund credit note number already exists',
				400
			);
		}
	}

	let invoice;

	try {
		invoice = await createOrUpdateInvoiceForCase(caseId, invoiceId, body);
	} catch (error) {
		// Unique constraint violation error (duplicate invoice number or refund credit note number)
		if (error?.code === 'P2002') {
			throw new BackOfficeAppError('An invoice with this invoice number already exists', 400);
		}
		if (error?.code === 'P2025') {
			throw new BackOfficeAppError(`Invoice ${invoiceId} not found`, 404);
		}
	}

	const project = await caseRepository.getById(params.id, additionalProjectEntities);

	if (!project) {
		throw new BackOfficeAppError(`Case ${params.id} not found`, 404);
	}

	if (isCreateRequest) {
		await broadcastNsipProjectEvent(project, EventType.Create);
	} else {
		await broadcastNsipProjectEvent(project, EventType.Update);
	}

	return res.status(isCreateRequest ? 201 : 200).send(invoice);
};

/**
 * Delete invoice for a given case
 *
 * @type {import('express').RequestHandler<{id:number, invoiceId:number}>}
 */
export const deleteInvoiceController = async ({ params }, res) => {
	const { id: caseId, invoiceId } = params;

	let invoice;

	try {
		invoice = await deleteInvoiceForCase(invoiceId);
	} catch (error) {
		if (error?.code === 'P2025') {
			throw new BackOfficeAppError(`Invoice ${invoiceId} not found`, 404);
		}
	}

	if (!invoice) {
		throw new BackOfficeAppError(`Invoice ${invoiceId} could not be deleted`, 400);
	}

	const project = await caseRepository.getById(caseId, additionalProjectEntities);

	if (!project) {
		throw new BackOfficeAppError(`Case ${caseId} not found`, 404);
	}

	await broadcastNsipProjectEvent(project, EventType.Update);

	return res.status(204).send();
};
