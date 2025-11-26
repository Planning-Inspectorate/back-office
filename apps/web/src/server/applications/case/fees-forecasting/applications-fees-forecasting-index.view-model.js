import {
	additionalCommentsURL,
	examiningInspectorsURL,
	feesHrefText,
	genericHrefText,
	memLastUpdatedURL,
	newMaturityURL
} from './fees-forecasting.config.js';
import { format } from 'date-fns';
import { buildSummaryList } from '../../../lib/summary-list-mapper.js';
import { buildTable } from '../../../lib/table-mapper.js';

/**
 * Determines the status tag for an invoice.
 *
 * @param {object|*} invoice
 * @returns {string}
 */
function getStatusTag(invoice) {
	if (invoice.refundIssueDate) {
		return `<strong class="govuk-tag govuk-tag--purple">Refunded</strong>`;
	}

	if (invoice.paymentDate) {
		return `<strong class="govuk-tag govuk-tag--green">Paid</strong>`;
	}

	if (invoice.paymentDueDate && new Date(invoice.paymentDueDate) < new Date()) {
		return `<strong class="govuk-tag govuk-tag--orange">Due</strong>`;
	}

	return `<strong class="govuk-tag govuk-tag--yellow">Issued</strong>`;
}

/**
 * @param {object|*} params
 * @returns {Promise<{ selectedPageType: string, internalUseSection: Array<Object>, accordionSections: Array<Object> }>}
 */
export const getFeesForecastingViewModel = async ({ caseData, invoices }) => {
	const internalUseSectionItems = [
		{
			key: 'New maturity',
			value: caseData.additionalDetails.newMaturity,
			actions: [{ href: newMaturityURL, text: genericHrefText, visuallyHiddenText: 'new maturity' }]
		},
		{
			key: 'Examining inspectors',
			html: [
				caseData.additionalDetails.numberBand2Inspectors
					? `${caseData.additionalDetails.numberBand2Inspectors} band 2 inspectors`
					: '',
				caseData.additionalDetails.numberBand3Inspectors
					? `${caseData.additionalDetails.numberBand3Inspectors} band 3 inspectors`
					: ''
			]
				.filter(Boolean)
				.join('<br/>'),
			actions: [
				{
					href: examiningInspectorsURL,
					text: genericHrefText,
					visuallyHiddenText: 'examining inspectors'
				}
			]
		},
		{
			key: 'MEM last updated',
			value: caseData.keyDates.preApplication.memLastUpdated
				? format(new Date(caseData.keyDates.preApplication.memLastUpdated * 1000), 'dd MMM yyyy')
				: '',
			actions: [
				{ href: memLastUpdatedURL, text: genericHrefText, visuallyHiddenText: 'MEM last updated' }
			]
		},
		{
			key: 'Additional comments (optional)',
			value: caseData.additionalDetails.additionalComments,
			actions: [
				{
					href: additionalCommentsURL,
					text: genericHrefText,
					visuallyHiddenText: 'additional comments'
				}
			]
		}
	];

	const feesSection = buildTable({
		headers: ['Stage', 'Amount', 'Invoice number', 'Status', 'Action'],
		rows: invoices.map(
			/** @param {object|*} invoice */
			(invoice) => [
				{ text: invoice.invoiceStage },
				{ text: `£${Number(invoice.amountDue).toLocaleString('en-GB')}` },
				{ text: invoice.invoiceNumber },
				{ html: getStatusTag(invoice) },
				{ html: `<a href="#" class="govuk-link">${feesHrefText}</a>` }
			]
		)
	});

	const accordionSections = [
		{
			heading: 'Pre-application overview',
			content: '',
			component: 'summary-list'
		},
		{
			heading: 'Fees',
			content: feesSection,
			component: 'table',
			buttonText: 'Add new fee',
			buttonLink: '#'
		},
		{
			heading: 'Pre-application project meetings',
			content: '',
			component: 'table',
			buttonText: 'Add project meeting',
			buttonLink: '#'
		},
		{
			heading: 'Pre-application evidence plan meetings',
			content: '',
			component: 'table',
			buttonText: 'Add evidence plan meeting',
			buttonLink: '#'
		},
		{
			heading: 'Pre-application supplementary components',
			content: '',
			component: 'summary-list'
		},
		{
			heading: 'Pre-application programme document',
			content: '',
			component: 'summary-list'
		}
	];

	return {
		selectedPageType: 'fees-forecasting',
		internalUseSection: buildSummaryList(internalUseSectionItems),
		accordionSections
	};
};
