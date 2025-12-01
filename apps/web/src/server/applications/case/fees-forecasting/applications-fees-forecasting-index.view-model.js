import {
	additionalCommentsURL,
	adequacyDateURL,
	anticipatedDateURL,
	examiningInspectorsURL,
	feesHrefText,
	genericHrefText,
	memLastUpdatedURL,
	newMaturityURL,
	planProcessURL,
	s61SummaryURL,
	scopingDateURL,
	tierURL,
	documentLinkURL,
	updatedDocumentReceivedDateURL,
	documentReviewedByEstDateURL,
	caseTeamIssuedCommentsDateURL
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
export const getFeesForecastingViewModel = async ({ caseData, invoices, meetings }) => {
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

	const overviewSectionItems = [
		{
			key: 'Tier',
			value: caseData.additionalDetails.tier,
			actions: [{ href: tierURL, text: genericHrefText, visuallyHiddenText: 'tier' }]
		},
		{
			key: 'Link to s61 summary',
			html: `<a href="#" class="govuk-link">${caseData.additionalDetails.s61SummaryURI}</a>`,
			actions: [
				{ href: s61SummaryURL, text: genericHrefText, visuallyHiddenText: 'link to s61 summary' }
			]
		},
		{
			key: 'Estimated scoping submission date',
			value: caseData.keyDates.preApplication.estimatedScopingSubmissionDate
				? format(
						new Date(caseData.keyDates.preApplication.estimatedScopingSubmissionDate * 1000),
						'dd MMM yyyy'
				  )
				: '',
			actions: [
				{
					href: scopingDateURL,
					text: genericHrefText,
					visuallyHiddenText: 'estimated scoping submission date'
				}
			]
		},
		{
			key: 'Adequacy of Consulation Milestone date',
			value: caseData.keyDates.preApplication.consultationMilestoneAdequacyDate
				? format(
						new Date(caseData.keyDates.preApplication.consultationMilestoneAdequacyDate * 1000),
						'dd MMM yyyy'
				  )
				: '',
			actions: [
				{
					href: adequacyDateURL,
					text: genericHrefText,
					visuallyHiddenText: 'adequacy of consultation milestone date'
				}
			]
		},
		{
			key: 'Evidence plan process',
			value: caseData.additionalDetails.planProcessEvidence
				? 'Required'
				: caseData.additionalDetails.planProcessEvidence
				? 'Not Required'
				: caseData.additionalDetails.planProcessEvidence,
			actions: [
				{ href: planProcessURL, text: genericHrefText, visuallyHiddenText: 'evidence plan process' }
			]
		},
		{
			key: 'Anticipated submission date internal',
			value: caseData.keyDates.preApplication.submissionAtInternal
				? format(
						new Date(caseData.keyDates.preApplication.submissionAtInternal * 1000),
						'dd MMM yyyy'
				  )
				: '',
			actions: [
				{
					href: anticipatedDateURL,
					text: genericHrefText,
					visuallyHiddenText: 'anticipated submission date internal'
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

	const projectMeetingsSection = buildTable({
		headers: ['Meeting agenda', 'Date', 'Action'],
		rows: meetings
			.filter(
				/** @param {object|*} meeting */
				(meeting) => meeting.meetingType === 'Pre-application' && meeting.pinsRole === null
			)
			.map(
				/** @param {object|*} meeting */
				(meeting) => [
					{ text: meeting.agenda },
					{ text: format(new Date(meeting.meetingDate), 'dd MMM yyyy') },
					{ html: `<a href="#" class="govuk-link">${genericHrefText}</a>` }
				]
			)
	});

	const getEvidencePlanMeetingSection = () => {
		const evidencePlanMeetings = meetings.filter(
			/** @param {object|*} meeting */
			(meeting) => meeting.meetingType === 'Pre-application' && meeting.pinsRole !== null
		);

		if (!evidencePlanMeetings.length) {
			return '';
		}

		return buildTable({
			headers: ['Issues discussed', 'Date', 'Action'],
			rows: evidencePlanMeetings.map(
				/** @param {object|*} meeting */
				(meeting) => [
					{ text: meeting.agenda },
					{ text: format(new Date(meeting.meetingDate), 'dd MMM yyyy') },
					{ html: `<a href="#" class="govuk-link">${genericHrefText}</a>` }
				]
			)
		});
	};

	const programmeDocumentSectionItems = [
		{
			key: 'Link to programme document',
			html: `<a href="#" class="govuk-link">${caseData.additionalDetails.programmeDocumentURI}</a>`,
			actions: [
				{
					href: documentLinkURL,
					text: genericHrefText,
					visuallyHiddenText: 'link to programme document'
				}
			]
		},
		{
			key: 'Date updated programme document is received',
			value: caseData.keyDates.preApplication.updatedProgrammeDocumentReceivedDate
				? format(
						new Date(caseData.keyDates.preApplication.updatedProgrammeDocumentReceivedDate * 1000),
						'dd MMM yyyy'
				  )
				: '',
			actions: [
				{
					href: updatedDocumentReceivedDateURL,
					text: genericHrefText,
					visuallyHiddenText: 'date updated programme document is received'
				}
			]
		},
		{
			key: 'Date programme document reviewed by EST',
			value: caseData.keyDates.preApplication.programmeDocumentReviewedByEstDate
				? format(
						new Date(caseData.keyDates.preApplication.programmeDocumentReviewedByEstDate * 1000),
						'dd MMM yyyy'
				  )
				: '',
			actions: [
				{
					href: documentReviewedByEstDateURL,
					text: genericHrefText,
					visuallyHiddenText: 'date programme document reviewed by EST'
				}
			]
		},
		{
			key: 'Date case team issued comments on programme document',
			value: caseData.keyDates.preApplication.caseTeamIssuedCommentsDate
				? format(
						new Date(caseData.keyDates.preApplication.caseTeamIssuedCommentsDate * 1000),
						'dd MMM yyyy'
				  )
				: '',
			actions: [
				{
					href: caseTeamIssuedCommentsDateURL,
					text: genericHrefText,
					visuallyHiddenText: 'date case team issued comments on programme document'
				}
			]
		}
	];

	const accordionSections = [
		{
			heading: 'Pre-application overview',
			content: buildSummaryList(overviewSectionItems),
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
			content: projectMeetingsSection,
			component: 'table',
			buttonText: 'Add project meeting',
			buttonLink: '#'
		},
		{
			heading: 'Pre-application evidence plan meetings',
			content: getEvidencePlanMeetingSection(),
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
			content: buildSummaryList(programmeDocumentSectionItems),
			component: 'summary-list'
		}
	];

	return {
		selectedPageType: 'fees-forecasting',
		internalUseSection: buildSummaryList(internalUseSectionItems),
		accordionSections
	};
};
