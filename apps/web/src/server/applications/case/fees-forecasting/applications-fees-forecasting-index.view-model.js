import {
	feesHrefText,
	genericHrefText,
	editPageURL,
	newMaturityDisplayValues,
	tierDisplayValues,
	invoiceStageDisplayValues,
	supplementaryComponentsDisplayValues,
	urlSectionNames
} from './fees-forecasting.config.js';
import { buildSummaryListRows } from '../../../lib/summary-list-mapper.js';
import { buildTable } from '../../../lib/table-mapper.js';
import { formatDateForDisplay } from '../../../lib/dates.js';
import { url } from '../../../lib/nunjucks-filters/url.js';
import { isPast, isToday, isFuture } from 'date-fns';

/**
 * Determines the status tag for an invoice
 *
 * @param {object|*} invoice
 * @returns {string}
 */
export function getStatusTag(invoice) {
	const dueDateIsPast = isPast(new Date(invoice.paymentDueDate));
	const dueDateIsToday = isToday(new Date(invoice.paymentDueDate));
	const dueDateIsFuture = isFuture(new Date(invoice.paymentDueDate));

	if (invoice.refundIssueDate) {
		return `<strong class="govuk-tag govuk-tag--purple">Refunded</strong>`;
	}

	if (invoice.paymentDate) {
		return `<strong class="govuk-tag govuk-tag--green">Paid</strong>`;
	}

	if (invoice.paymentDueDate && (dueDateIsToday || dueDateIsPast)) {
		return `<strong class="govuk-tag govuk-tag--orange">Due</strong>`;
	}

	if (invoice.paymentDueDate && dueDateIsFuture) {
		return `<strong class="govuk-tag govuk-tag--yellow">Issued</strong>`;
	}

	return '';
}

/**
 * Creates HTML string for links
 *
 * @param {string|null} linkText
 * @param {string} href
 * @returns {string}
 */
export const getLinkHTML = (linkText, href) =>
	linkText ? `<a href="${href}" class="govuk-link">${linkText}</a>` : '';

/**
 * Creates edit page URLs
 *
 * @param {string} sectionName
 * @param {number} caseId
 * @returns {string}
 */
export const getEditPageURL = (sectionName, caseId) =>
	sectionName ? url('fees-forecasting', { caseId, step: sectionName }) : '';

/**
 * Converts snake_case enum value into string for display
 *
 * @param {Record<string,string>} displayValues
 * @param {string|null} enumValue
 * @returns {string}
 */
export const getDisplayValue = (displayValues, enumValue) =>
	enumValue ? displayValues[enumValue] : '';

/**
 * Displays submission date if item has been submitted
 *
 * @param {Record<string,string>} displayValues
 * @param {string|null} submissionStatus
 * @param {number|null} submissionDate
 * @returns {string}
 */
export const getSupplementaryComponentItem = (displayValues, submissionStatus, submissionDate) => {
	if (!submissionStatus) return '';

	const submissionStatusForDisplay = getDisplayValue(displayValues, submissionStatus);
	const submissionDateForDisplay = formatDateForDisplay(submissionDate);

	return submissionStatusForDisplay === supplementaryComponentsDisplayValues.submitted_by_applicant
		? `${submissionStatusForDisplay}, ${submissionDateForDisplay}`
		: `${submissionStatusForDisplay}`;
};

/**
 * @param {object|*} params
 * @returns {object}
 */
export const getFeesForecastingIndexViewModel = ({ caseData, invoices, meetings }) => {
	const internalUseSectionItems = [
		{
			key: 'New maturity',
			value: getDisplayValue(newMaturityDisplayValues, caseData.additionalDetails.newMaturity),
			actions: [
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'new maturity'
				}
			]
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
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'examining inspectors'
				}
			]
		},
		{
			key: 'MEM last updated',
			value: formatDateForDisplay(caseData.keyDates.preApplication.memLastUpdated),
			actions: [
				{
					href: getEditPageURL(urlSectionNames.maturityEvaluationMatrix, caseData.id),
					text: genericHrefText,
					visuallyHiddenText: 'MEM last updated'
				}
			]
		},
		{
			key: 'Additional comments (optional)',
			html: caseData.additionalDetails.additionalComments
				? `${caseData.additionalDetails.additionalComments}`
				: '',
			actions: [
				{
					href: editPageURL,
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
			actions: [{ href: editPageURL, text: genericHrefText, visuallyHiddenText: 'tier' }]
		},
		{
			key: 'Link to s61 summary',
			html: getLinkHTML(caseData.additionalDetails.s61SummaryURI, '#'),
			actions: [
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'link to s61 summary'
				}
			]
		},
		{
			key: 'Estimated scoping submission date',
			value: formatDateForDisplay(caseData.keyDates.preApplication.estimatedScopingSubmissionDate),
			actions: [
				{
					href: getEditPageURL(urlSectionNames.scopingSubmission, caseData.id),
					text: genericHrefText,
					visuallyHiddenText: 'estimated scoping submission date'
				}
			]
		},
		{
			key: 'Adequacy of Consultation Milestone (AoCM) date',
			value: formatDateForDisplay(
				caseData.keyDates.preApplication.consultationMilestoneAdequacyDate
			),
			actions: [
				{
					href: getEditPageURL(urlSectionNames.consultationMilestone, caseData.id),
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
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'evidence plan process'
				}
			]
		},
		{
			key: 'Anticipated submission date internal',
			value: formatDateForDisplay(caseData.keyDates.preApplication.submissionAtInternal),
			actions: [
				{
					// User should be redirected to the existing key dates page
					href: url('key-dates', {
						caseId: caseData.id,
						step: urlSectionNames.preApplicationSection,
						query: urlSectionNames.submissionAtInternal
					}),
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
					{ text: invoice.amountDue ? `£${invoice.amountDue}` : '' },
					{ text: invoice.invoiceNumber },
					{ html: getStatusTag(invoice) },
					{ html: getLinkHTML(feesHrefText, '#') }
				]
			)
		});
	};

	const getProjectMeetingsSection = () => {
		// User should be redirected to the existing key dates page to edit this value
		const inceptionMeetingHref = url('key-dates', {
			caseId: caseData.id,
			step: urlSectionNames.preApplicationSection,
			query: urlSectionNames.inceptionMeetingDate
		});

		const inceptionMeeting = [
			{ text: 'Inception meeting' },
			{ text: formatDateForDisplay(caseData.keyDates.preApplication.inceptionMeetingDate) },
			{ html: getLinkHTML(genericHrefText, inceptionMeetingHref) }
		];

		const projectMeetings = meetings
			.filter(
				/** @param {object|*} meeting */
				(meeting) => meeting.meetingType === 'project'
			)
			.map(
				/** @param {object|*} meeting */
				(meeting) => [
					{ text: meeting.agenda },
					{ text: formatDateForDisplay(meeting.meetingDate) },
					{ html: getLinkHTML(genericHrefText, '#') }
				]
			);

		const meetingsToDisplay = [inceptionMeeting, ...projectMeetings];

		return buildTable({
			headers: ['Meeting agenda', 'Date', 'Action'],
			rows: meetingsToDisplay
		});
	};

	const getEvidencePlanMeetingsSection = () => {
		const evidencePlanMeetings = meetings.filter(
			/** @param {object|*} meeting */
			(meeting) => meeting.meetingType === 'evidence_plan'
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
					{ text: formatDateForDisplay(meeting.meetingDate) },
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
					href: editPageURL,
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
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'essential fast track components'
				}
			]
		},
		{
			key: 'Principal area disagreement summary statement (PADSS)',
			value: getSupplementaryComponentItem(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.principalAreaDisagreementSummaryStmt,
				caseData.keyDates.preApplication.principalAreaDisagreementSummaryStmtSubmittedDate
			),
			actions: [
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'principal area disagreement summary statement (PADSS)'
				}
			]
		},
		{
			key: 'Policy compliance document (PCD)',
			value: getSupplementaryComponentItem(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.policyComplianceDocument,
				caseData.keyDates.preApplication.policyComplianceDocumentSubmittedDate
			),
			actions: [
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'policy compliance document (PCD)'
				}
			]
		},
		{
			key: 'Design approach document (DAD)',
			value: getSupplementaryComponentItem(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.designApproachDocument,
				caseData.keyDates.preApplication.designApproachDocumentSubmittedDate
			),
			actions: [
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'design approach document (DAD)'
				}
			]
		},
		{
			key: 'Mature outline control documents',
			value: getSupplementaryComponentItem(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.matureOutlineControlDocument,
				caseData.keyDates.preApplication.matureOutlineControlDocumentSubmittedDate
			),
			actions: [
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'mature outline control documents'
				}
			]
		},
		{
			key: 'CA and TP evidence',
			value: getSupplementaryComponentItem(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.caAndTpEvidence,
				caseData.keyDates.preApplication.caAndTpEvidenceSubmittedDate
			),
			actions: [
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'CA and TP evidence'
				}
			]
		},
		{
			key: 'Public sector equality duty (PSED)',
			value: getSupplementaryComponentItem(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.publicSectorEqualityDuty,
				caseData.keyDates.preApplication.publicSectorEqualityDutySubmittedDate
			),
			actions: [
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'public sector equality duty (PSED)'
				}
			]
		},
		{
			key: 'Fast track admission document',
			value: getSupplementaryComponentItem(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.fastTrackAdmissionDocument,
				caseData.keyDates.preApplication.fastTrackAdmissionDocumentSubmittedDate
			),
			actions: [
				{
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'fast track admission document'
				}
			]
		},
		{
			key: 'Multiparty application readiness gate-check (trial)',
			value: getSupplementaryComponentItem(
				supplementaryComponentsDisplayValues,
				caseData.additionalDetails.multipartyApplicationCheckDocument,
				caseData.keyDates.preApplication.multipartyApplicationCheckDocumentSubmittedDate
			),
			actions: [
				{
					href: editPageURL,
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
					href: editPageURL,
					text: genericHrefText,
					visuallyHiddenText: 'link to programme document'
				}
			]
		},
		{
			key: 'Date updated programme document is received',
			value: formatDateForDisplay(
				caseData.keyDates.preApplication.updatedProgrammeDocumentReceivedDate
			),
			actions: [
				{
					href: getEditPageURL(urlSectionNames.programmeDocumentReceived, caseData.id),
					text: genericHrefText,
					visuallyHiddenText: 'date updated programme document is received'
				}
			]
		},
		{
			key: 'Date programme document reviewed by EST',
			value: formatDateForDisplay(
				caseData.keyDates.preApplication.programmeDocumentReviewedByEstDate
			),
			actions: [
				{
					href: getEditPageURL(urlSectionNames.programmeDocumentReviewed, caseData.id),
					text: genericHrefText,
					visuallyHiddenText: 'date programme document reviewed by EST'
				}
			]
		},
		{
			key: 'Date case team issued comments on programme document',
			value: formatDateForDisplay(caseData.keyDates.preApplication.caseTeamIssuedCommentsDate),
			actions: [
				{
					href: getEditPageURL(urlSectionNames.programmeDocumentComments, caseData.id),
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
			buttonLink: getEditPageURL(urlSectionNames.addNewFee, caseData.id)
		},
		{
			heading: 'Pre-application project meetings',
			content: getProjectMeetingsSection(),
			component: 'table',
			buttonText: 'Add project meeting',
			buttonLink: getEditPageURL(urlSectionNames.addProjectMeeting, caseData.id)
		},
		{
			heading: 'Pre-application evidence plan meetings',
			content: getEvidencePlanMeetingsSection(),
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
