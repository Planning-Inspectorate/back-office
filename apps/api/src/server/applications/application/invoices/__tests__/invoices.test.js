import { request } from '#app-test';

const { databaseConnector } = await import('#utils/database-connector.js');

const caseId = 100000000;

const invoices = [
	{
		id: 1,
		invoiceNumber: 'INV-2025-001',
		caseId,
		invoiceStage: 'pre_acceptance',
		amountDue: '1500.00',
		paymentDueDate: '2025-11-15T00:00:00.000Z',
		invoicedDate: '2025-10-20T00:00:00.000Z',
		paymentDate: null,
		refundCreditNoteNumber: null,
		refundAmount: null,
		refundIssueDate: null,
		createdAt: '2025-10-30T13:46:44.260Z'
	},
	{
		id: 2,
		invoiceNumber: 'INV-2025-002',
		caseId,
		invoiceStage: 'acceptance',
		amountDue: '2750.50',
		paymentDueDate: '2025-12-01T00:00:00.000Z',
		invoicedDate: '2025-10-28T00:00:00.000Z',
		paymentDate: '2025-11-05T00:00:00.000Z',
		refundCreditNoteNumber: 'CN-001',
		refundAmount: '100.00',
		refundIssueDate: '2025-11-10T00:00:00.000Z',
		createdAt: '2025-10-30T13:46:44.260Z'
	}
];

describe('Invoices API', () => {
	beforeEach(() => {
		databaseConnector.invoice.findMany?.mockReset?.();
		databaseConnector.invoice.findFirst.mockReset?.();
		databaseConnector.invoice.create.mockReset?.();
		databaseConnector.invoice.update?.mockReset?.();
		databaseConnector.invoice.delete.mockReset?.();
	});
	describe('GET /applications/:id/invoices', () => {
		it('returns 200 with all invoices for the case', async () => {
			databaseConnector.invoice.findMany.mockResolvedValue(invoices);
			const res = await request.get(`/applications/${caseId}/invoices`);
			expect(res.status).toBe(200);
			expect(databaseConnector.invoice.findMany).toHaveBeenCalledWith({
				where: { caseId },
				orderBy: { createdAt: 'asc' }
			});
			expect(res.body).toEqual(invoices);
		});

		it('returns 404 when there are no invoices for the given case', async () => {
			databaseConnector.invoice.findMany.mockResolvedValue([]);
			const res = await request.get(`/applications/${caseId}/invoices`);
			expect(res.status).toBe(404);
			expect(databaseConnector.invoice.findMany).toHaveBeenCalledWith({
				where: { caseId },
				orderBy: { createdAt: 'asc' }
			});
			expect(res.body).toEqual({
				errors: { invoices: `No invoices found for case ${caseId}` }
			});
		});
	});

	describe('GET /applications/:id/invoices/:invoiceId', () => {
		it('gets single invoice by Id and case Id', async () => {
			const row = invoices[1];
			databaseConnector.invoice.findFirst.mockResolvedValue(row);
			const res = await request.get(`/applications/${caseId}/invoices/${row.id}`);
			expect(res.status).toBe(200);
			expect(databaseConnector.invoice.findFirst).toHaveBeenCalledWith({
				where: { id: invoices[1].id }
			});
			expect(res.body).toEqual(row);
		});

		it('returns 404 when invoice is not found for the case', async () => {
			databaseConnector.invoice.findFirst.mockResolvedValue(null);
			const res = await request.get(`/applications/${caseId}/invoices/INV-DOES-NOT-EXIST`);
			expect(res.status).toBe(404);
			expect(res.body).toEqual({
				errors: { invoice: `Invoice INV-DOES-NOT-EXIST not found` }
			});
		});
	});

	describe('POST /applications/:id/invoices', () => {
		const payload = {
			invoiceNumber: 'INV-2025-003',
			invoiceStage: 'pre_examination',
			amountDue: '999.99',
			paymentDueDate: '2025-12-20T00:00:00.000Z',
			invoicedDate: '2025-11-03T00:00:00.000Z',
			paymentDate: null,
			refundCreditNoteNumber: null,
			refundAmount: null,
			refundIssueDate: null
		};

		it('201 creates an invoice', async () => {
			const created = { id: 3, caseId, ...payload, createdAt: '2025-11-03T12:00:00.000Z' };
			databaseConnector.invoice.create.mockResolvedValueOnce(created);

			const res = await request.post(`/applications/${caseId}/invoices`).send(payload);

			expect(res.status).toBe(201);
			expect(res.body).toEqual(created);
			expect(databaseConnector.invoice.create).toHaveBeenCalledWith({
				data: { caseId, ...payload }
			});
		});

		it('400 on global duplicate (Prisma P2002)', async () => {
			databaseConnector.invoice.findFirst.mockResolvedValueOnce(null);
			databaseConnector.invoice.create.mockRejectedValueOnce(
				Object.assign(new Error('Unique constraint'), { code: 'P2002' })
			);

			const res = await request.post(`/applications/${caseId}/invoices`).send({
				...payload,
				invoiceNumber: 'INV-ALREADY-GLOBAL'
			});

			expect(res.status).toBe(400);
			expect(res.body).toEqual({
				errors: { invoice: `An invoice with this invoice number already exists` }
			});
		});

		it('400 when invoice number missing', async () => {
			const res = await request.post(`/applications/${caseId}/invoices`).send({
				...payload,
				invoiceNumber: undefined
			});
			expect(res.status).toBe(400);
			expect(res.body).toEqual({
				errors: { invoiceNumber: 'Invoice number is required' }
			});
		});
	});

	describe('PATCH /applications/:id/invoices/:invoiceId', () => {
		const updatePayload = {
			amountDue: '1234.50'
		};

		it('200 updates an invoice', async () => {
			databaseConnector.invoice.update.mockResolvedValueOnce({ ...invoices[1], ...updatePayload });

			const res = await request
				.patch(`/applications/${caseId}/invoices/${invoices[1].id}`)
				.send(updatePayload);

			expect(res.status).toBe(200);
			expect(res.body).toEqual({ ...invoices[1], amountDue: updatePayload.amountDue });

			expect(databaseConnector.invoice.update).toHaveBeenCalledTimes(1);
		});

		it('404 when invoice not found for given case', async () => {
			databaseConnector.invoice.update.mockRejectedValueOnce(
				Object.assign(new Error('Record not found'), { code: 'P2025' })
			);
			const missingId = 999999;

			const res = await request
				.patch(`/applications/${caseId}/invoices/${missingId}`)
				.send({ amountDue: '10.00' });

			expect(res.status).toBe(404);
			expect(res.body).toEqual({
				errors: { invoice: `Invoice ${missingId} not found` }
			});
		});
	});

	describe('DELETE /applications/:id/invoices/:invoiceId', () => {
		it('204 deletes when invoice belongs to the case', async () => {
			databaseConnector.invoice.delete.mockResolvedValueOnce({});

			const res = await request.delete(`/applications/${caseId}/invoices/${invoices[1].id}`);

			expect(res.status).toBe(204);
			expect(databaseConnector.invoice.delete).toHaveBeenCalled();
		});

		it('404 when invoice not found for the case', async () => {
			databaseConnector.invoice.delete.mockRejectedValueOnce(
				Object.assign(new Error('Record not found'), { code: 'P2025' })
			);
			const missingId = 99999;
			const res = await request.delete(`/applications/${caseId}/invoices/${missingId}`);
			expect(res.status).toBe(404);
			expect(res.body).toEqual({
				errors: { invoice: `Invoice ${missingId} not found` }
			});
		});
	});
});
