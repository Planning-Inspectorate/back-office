import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';

const invoiceStages = [
	'pre_acceptance',
	'acceptance',
	'pre_examination',
	'initial_examination',
	'final_examination'
];

// Accepts "123.00", "123.40", "123.45"
const AMOUNT_REGEX = /^\d+(\.\d{2})$/;

export const validateCreateInvoice = composeMiddleware(
	body('invoiceNumber')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('Invoice number is required')
		.isString()
		.withMessage('Invoice number must be a string')
		.trim(),
	body('invoiceStage')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage(
			'The invoice stage must be one of:  pre_acceptance, acceptance, pre_examination,  initial_examination or final_examination.'
		)
		.isIn(invoiceStages)
		.withMessage(
			'The invoice stage must be one of:  pre_acceptance, acceptance, pre_examination,  initial_examination or final_examination.'
		),
	body('amountDue')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('Enter a valid amount for the amount due in the decimal format, e.g.  100.00.')
		.isString()
		.matches(AMOUNT_REGEX)
		.withMessage('Enter a valid amount for the amount due in the decimal format, e.g.  100.00.'),
	body('paymentDueDate')
		.optional({ nullable: true, checkFalsy: true })
		.isISO8601()
		.withMessage('Enter a valid date for the payment due date.'),
	body('invoicedDate')
		.optional({ nullable: true, checkFalsy: true })
		.isISO8601()
		.withMessage('Enter a valid date for the invoice date.'),
	body('paymentDate')
		.optional({ nullable: true, checkFalsy: true })
		.isISO8601()
		.withMessage('Enter a valid date for the payment date.'),
	body('refundCreditNoteNumber')
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.withMessage('refundCreditNoteNumber must be a string')
		.trim(),
	body('refundAmount')
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.withMessage('Enter a valid amount for the amount refunded in the decimal format')
		.matches(AMOUNT_REGEX)
		.withMessage('Enter a valid amount for the Amount refunded in the decimal format'),
	body('refundIssueDate')
		.optional({ nullable: true, checkFalsy: true })
		.isISO8601()
		.withMessage('Enter a valid date for the refund issue date.'),
	validationErrorHandler
);

export const validateUpdateInvoice = composeMiddleware(
	body('invoiceStage')
		.optional({ nullable: true, checkFalsy: true })
		.isIn(invoiceStages)
		.withMessage(
			'The invoice stage must be one of:  pre_acceptance, acceptance, pre_examination,  initial_examination or final_examination.'
		),
	body('amountDue')
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.matches(AMOUNT_REGEX)
		.withMessage('Enter a valid amount for the amount due in the decimal format, e.g.  100.00.'),
	body('paymentDueDate')
		.optional({ nullable: true, checkFalsy: true })
		.isISO8601()
		.withMessage('Enter a valid date for the payment due date.'),
	body('invoicedDate')
		.optional({ nullable: true, checkFalsy: true })
		.isISO8601()
		.withMessage('Enter a valid date for the invoice date.'),
	body('paymentDate')
		.optional({ nullable: true, checkFalsy: true })
		.isISO8601()
		.withMessage('Enter a valid date for the payment date.'),
	body('refundCreditNoteNumber')
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.withMessage('refundCreditNoteNumber must be a string')
		.trim(),
	body('refundAmount')
		.optional({ nullable: true, checkFalsy: true })
		.isString()
		.matches(AMOUNT_REGEX)
		.withMessage('Enter a valid amount for the Amount refunded in the decimal format'),
	body('refundIssueDate')
		.optional({ nullable: true, checkFalsy: true })
		.isISO8601()
		.withMessage('Enter a valid date for the refund issue date.'),
	validationErrorHandler
);
