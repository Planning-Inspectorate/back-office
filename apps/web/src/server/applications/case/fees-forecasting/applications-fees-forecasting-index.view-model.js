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
	issuesTrackerURL,
	essentialFastTrackComponentsURL,
	principalAreaDisagreementSummaryStmtURL,
	policyComplianceDocumentURL,
	designApproachDocumentURL,
	matureOutlineControlDocumentURL,
	caAndTpEvidenceURL,
	publicSectorEqualityDutyURL,
	fastTrackAdmissionDocumentURL,
	multipartyApplicationCheckDocumentURL,
	documentLinkURL,
	updatedDocumentReceivedDateURL,
	documentReviewedByEstDateURL,
	caseTeamIssuedCommentsDateURL,
	newMaturityDisplayValues,
	tierDisplayValues,
	invoiceStageDisplayValues,
	supplementaryComponentsDisplayValues
} from './fees-forecasting.config.js';
import { format } from 'date-fns';
import { buildSummaryListRows } from '../../../lib/summary-list-mapper.js';
import { buildTable } from '../../../lib/table-mapper.js';

/**
 * Determines the status tag for an invoice.
 *
 * @param {object|*} invoice
 * @returns {string}
 */
export function getStatusTag(invoice) {
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
 * Converts unix timestamp into date string.
 *
 * @param {number|null} timestamp
 * @returns {string}
 */
export const formatUnixTimestamp = (timestamp) =>
	timestamp ? format(new Date(timestamp * 1000), 'dd MMM yyyy') : '';

/**
 * Creates HTML string for link text.
 *
 * @param {string|null} linkText
 * @param {string} href
 * @returns {string}
 */
export const getLinkHTML = (linkText, href) =>
	linkText ? `<a href="${href}" class="govuk-link">${linkText}</a>` : '';

/**
 * Converts snake_case enum value into string for display.
 *
 * @param {Record<string,string>} displayValues
 * @param {string|null} enumValue
 * @returns {string}
 */
export const getDisplayValue = (displayValues, enumValue) =>
	enumValue ? displayValues[enumValue] : '';

/**
 * @param {object|*} params
 * @returns {Promise<{ selectedPageType: string, internalUseSection: Array<Object>, accordionSections: Array<Object> }>}
 */
export const getFeesForecastingViewModel = async ({ caseData, invoices, meetings }) => {
	const internalUseSectionItems = [
		{
			key: 'New maturity',
			value: getDisplayValue(newMaturityDisplayValues, caseData.additionalDetails.newMaturity),
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
			value: formatUnixTimestamp(caseData.keyDates.preApplication.memLastUpdated),
			actions: [
				{ href: memLastUpdatedURL, text: genericHrefText, visuallyHiddenText: 'MEM last updated' }
			]
		},
		{
			key: 'Additional comments (optional)',
			html: `<p id="additional-comments" class="govuk-body" data-full="${caseData.additionalDetails.additionalComments}"><span class="comment-text"></span></br><a href="#" class="comment-toggle govuk-link govuk-link--no-visited-state">See more</a><noscript>${caseData.additionalDetails.additionalComments}</noscript></p>`,
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
			value: getDisplayValue(tierDisplayValues, caseData.additionalDetails.tier),
			actions: [{ href: tierURL, text: genericHrefText, visuallyHiddenText: 'tier' }]
		},
		{
			key: 'Link to s61 summary',
			html: getLinkHTML(caseData.additionalDetails.s61SummaryURI, '#'),
			actions: [
				{ href: s61SummaryURL, text: genericHrefText, visuallyHiddenText: 'link to s61 summary' }
			]
		},
		{
			key: 'Estimated scoping submission date',
			value: formatUnixTimestamp(caseData.keyDates.preApplication.estimatedScopingSubmissionDate),
			actions: [
				{
					href: scopingDateURL,
					text: genericHrefText,
					visuallyHiddenText: 'estimated scoping submission date'
				}
			]
		},
		{
			key: 'Adequacy of Consultation Milestone (AoCM) date',
			value: formatUnixTimestamp(
				caseData.keyDates.preApplication.consultationMilestoneAdequacyDate
			),
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
			value:
				caseData.additionalDetails.planProcessEvidence === true
					? 'Required'
					: caseData.additionalDetails.planProcessEvidence === false
					? 'Not required'
					: '',
			actions: [
				{ href: planProcessURL, text: genericHrefText, visuallyHiddenText: 'evidence plan process' }
			]
		},
		{
			key: 'Anticipated submission date internal',
			value: formatUnixTimestamp(caseData.keyDates.preApplication.submissionAtInternal),
			actions: [
				{
					href: anticipatedDateURL,
					text: genericHrefText,
					visuallyHiddenText: 'anticipated submission date internal'
				}
			]
		}
	];

	const getFeesSection = () => {
		if (!invoices.length) {
			return '';
		}

		return buildTable({
			headers: ['Stage', 'Amount', 'Invoice number', 'Status', 'Action'],
			rows: invoices.map(
				/** @param {object|*} invoice */
				(invoice) => [
					{ text: getDisplayValue(invoiceStageDisplayValues, invoice.invoiceStage) },
					{ text: `£${invoice.amountDue}` },
					{ text: invoice.invoiceNumber },
					{ html: getStatusTag(invoice) },
					{ html: getLinkHTML(feesHrefText, '#') }
				]
			)
		});
	};

	const projectMeetingsSection = buildTable({
		headers: ['Meeting agenda', 'Date', 'Action'],
		rows:
			meetings.filter(
				/** @param {object|*} meeting */
				(meeting) => meeting.meetingType === 'pre_application' && meeting.pinsRole === null
			).length === 0
				? [
						[
							{ text: 'Inception meeting' },
							{ text: '' },
							{ html: getLinkHTML(genericHrefText, '#') }
						]
				  ]
				: meetings
						.filter(
							/** @param {object|*} meeting */
							(meeting) => meeting.meetingType === 'pre_application' && meeting.pinsRole === null
						)
						.map(
							/** @param {object|*} meeting */
							(meeting) => [
								{ text: meeting.agenda },
								{ text: format(new Date(meeting.meetingDate), 'dd MMM yyyy') },
								{ html: getLinkHTML(genericHrefText, '#') }
							]
						)
	});

	const getEvidencePlanMeetingSection = () => {
		const evidencePlanMeetings = meetings.filter(
			/** @param {object|*} meeting */
			(meeting) => meeting.meetingType === 'pre_application' && meeting.pinsRole !== null
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
					{ html: getLinkHTML(genericHrefText, '#') }
				]
			)
		});
	};

	const supplementaryComponentsSectionItems = [
		{
			key: 'Link to issues tracker',
			html: getLinkHTML(caseData.additionalDetails.issuesTracker, '#'),
			actions: [
				{
					href: issuesTrackerURL,
					text: genericHrefText,
					visuallyHiddenText: 'link to issues tracker'
				}
			]
		},
		{
			key: 'Essential fast track components',
			value:
				caseData.additionalDetails.essentialFastTrackComponents === true
					? 'Yes'
					: caseData.additionalDetails.essentialFastTrackComponents === false
					? 'No'
					: '',
			actions: [
				{
					href: essentialFastTrackComponentsURL,
					text: genericHrefText,
					visuallyHiddenText: 'essential fast track components'
				}
			]
		},
		{
			key: 'Principal area disagreement summary statement (PADSS)',
			value:
				caseData.additionalDetails.principalAreaDisagreementSummaryStmt === 'submitted_by_applicant'
					? `${getDisplayValue(
							supplementaryComponentsDisplayValues,
							caseData.additionalDetails.principalAreaDisagreementSummaryStmt
					  )}, ${formatUnixTimestamp(
							caseData.keyDates.preApplication.principalAreaDisagreementSummaryStmtSubmittedDate
					  )}`
					: getDisplayValue(
							supplementaryComponentsDisplayValues,
							caseData.additionalDetails.principalAreaDisagreementSummaryStmt
					  ),
			actions: [
				{
					href: principalAreaDisagreementSummaryStmtURL,
					text: genericHrefText,
					visuallyHiddenText: 'principal area disagreement summary statement (PADSS)'
				}
			]
		},
		{
			key: 'Policy compliance document (PCD)',
			value: getDisplayValue(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.policyComplianceDocument
			),
			actions: [
				{
					href: policyComplianceDocumentURL,
					text: genericHrefText,
					visuallyHiddenText: 'policy compliance document (PCD)'
				}
			]
		},
		{
			key: 'Design approach document (DAD)',
			value: getDisplayValue(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.designApproachDocument
			),
			actions: [
				{
					href: designApproachDocumentURL,
					text: genericHrefText,
					visuallyHiddenText: 'design approach document (DAD)'
				}
			]
		},
		{
			key: 'Mature outline control documents',
			value: getDisplayValue(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.matureOutlineControlDocument
			),
			actions: [
				{
					href: matureOutlineControlDocumentURL,
					text: genericHrefText,
					visuallyHiddenText: 'mature outline control documents'
				}
			]
		},
		{
			key: 'CA and TP evidence',
			value: getDisplayValue(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.caAndTpEvidence
			),
			actions: [
				{
					href: caAndTpEvidenceURL,
					text: genericHrefText,
					visuallyHiddenText: 'CA and TP evidence'
				}
			]
		},
		{
			key: 'Public sector equality duty (PSED)',
			value: getDisplayValue(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.publicSectorEqualityDuty
			),
			actions: [
				{
					href: publicSectorEqualityDutyURL,
					text: genericHrefText,
					visuallyHiddenText: 'public sector equality duty (PSED)'
				}
			]
		},
		{
			key: 'Fast track admission document',
			value: getDisplayValue(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.fastTrackAdmissionDocument
			),
			actions: [
				{
					href: fastTrackAdmissionDocumentURL,
					text: genericHrefText,
					visuallyHiddenText: 'fast track admission document'
				}
			]
		},
		{
			key: 'Multiparty application readiness gate-check (trial)',
			value: getDisplayValue(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.multipartyApplicationCheckDocument
			),
			actions: [
				{
					href: multipartyApplicationCheckDocumentURL,
					text: genericHrefText,
					visuallyHiddenText: 'multiparty application readiness gate-check (trial)'
				}
			]
		}
	];

	const programmeDocumentSectionItems = [
		{
			key: 'Link to programme document',
			html: getLinkHTML(caseData.additionalDetails.programmeDocumentURI, '#'),
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
			value: formatUnixTimestamp(
				caseData.keyDates.preApplication.updatedProgrammeDocumentReceivedDate
			),
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
			value: formatUnixTimestamp(
				caseData.keyDates.preApplication.programmeDocumentReviewedByEstDate
			),
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
			value: formatUnixTimestamp(caseData.keyDates.preApplication.caseTeamIssuedCommentsDate),
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
			content: buildSummaryListRows(overviewSectionItems),
			component: 'summary-list'
		},
		{
			heading: 'Fees',
			content: getFeesSection(),
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
			content: buildSummaryListRows(supplementaryComponentsSectionItems),
			component: 'summary-list'
		},
		{
			heading: 'Pre-application programme document',
			content: buildSummaryListRows(programmeDocumentSectionItems),
			component: 'summary-list'
		}
	];

	return {
		selectedPageType: 'fees-forecasting',
		internalUseSection: buildSummaryListRows(internalUseSectionItems),
		accordionSections
	};
};
