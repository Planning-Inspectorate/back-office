import { formatAmount, formatInvoiceAmounts, formatInvoicesAmounts } from '../invoices.utils.js';
import { Decimal } from '@prisma/client/runtime/client';

const mockInvoices = [
	{
		id: 1,
		invoiceNumber: '234920001',
		caseId: 100000000,
		invoiceStage: 'pre_acceptance',
		amountDue: new Decimal('1500.0000000000000000'),
		paymentDueDate: new Date('2025-11-15T00:00:00.000Z'),
		invoicedDate: new Date('2025-10-20T00:00:00.000Z'),
		paymentDate: null,
		refundCreditNoteNumber: null,
		refundAmount: new Decimal('65.0000000000000000'),
		refundIssueDate: null,
		createdAt: '2025-10-30T13:46:44.260Z'
	},
	{
		id: 2,
		invoiceNumber: '234920002',
		caseId: 100000000,
		invoiceStage: 'acceptance',
		amountDue: new Decimal('2750.5000000000000000'),
		paymentDueDate: new Date('2025-12-01T00:00:00.000Z'),
		invoicedDate: new Date('2025-10-28T00:00:00.000Z'),
		paymentDate: new Date('2025-11-05T00:00:00.000Z'),
		refundCreditNoteNumber: 'CN-001',
		refundAmount: new Decimal('100.0000000000000000'),
		refundIssueDate: '2025-11-10T00:00:00.000Z',
		createdAt: '2025-10-30T13:46:44.260Z'
	}
];

describe('invoices.utils.js', () => {
	describe('#formatAmount', () => {
		it('should return the raw amount if null', () => {
			const rawAmount = null;
			const result = formatAmount(rawAmount);

			expect(result).toEqual(null);
		});

		it('should return the raw amount if undefined', () => {
			const rawAmount = undefined;
			const result = formatAmount(rawAmount);

			expect(result).toEqual(undefined);
		});

		it('should return decimal values as strings to two decimal places', () => {
			const rawAmount = new Decimal('67851.2200000000000000');
			const result = formatAmount(rawAmount);

			expect(result).toEqual('67851.22');
		});
	});

	describe('#formatInvoiceAmounts', () => {
		it('should return the invoice if null', () => {
			const invoice = null;
			const result = formatInvoiceAmounts(invoice);

			expect(result).toEqual(null);
		});

		it('should return the invoice if undefined', () => {
			const invoice = undefined;
			const result = formatInvoiceAmounts(invoice);

			expect(result).toEqual(undefined);
		});

		it('should correctly format the amount fields on an invoice', () => {
			const invoice = mockInvoices[1];
			const result = formatInvoiceAmounts(invoice);

			expect(result).toEqual({
				...invoice,
				amountDue: '2750.50',
				refundAmount: '100.00'
			});
		});
	});

	describe('#formatInvoicesAmounts', () => {
		it('should return the invoices if null', () => {
			const invoices = null;
			const result = formatInvoicesAmounts(invoices);

			expect(result).toEqual(null);
		});

		it('should return the invoices if undefined', () => {
			const invoices = undefined;
			const result = formatInvoicesAmounts(invoices);

			expect(result).toEqual(undefined);
		});

		it('should return the invoices if an empty array', () => {
			const invoices = [];
			const result = formatInvoicesAmounts(invoices);

			expect(result).toEqual([]);
		});

		it('should correctly format the amount fields for all invoices', () => {
			const result = formatInvoicesAmounts(mockInvoices);

			expect(result).toEqual([
				{
					...mockInvoices[0],
					amountDue: '1500.00',
					refundAmount: '65.00'
				},
				{
					...mockInvoices[1],
					amountDue: '2750.50',
					refundAmount: '100.00'
				}
			]);
		});
	});
});
