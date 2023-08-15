import { addressToString } from '../../lib/address-formatter.js';
import { dateToDisplayDate } from '../../lib/dates.js';
import { convertFromBooleanToYesNoWithOptionalDetails } from '#lib/boolean-formatter.js';

/**
 * @typedef {import("../../lib/nunjucks-template-builders/summary-list-builder.js").BuilderParameters} SummaryListBuilderParameters
 */

/**
 * @typedef {import("../../lib/nunjucks-template-builders/table-builder.js").BuilderParameters} TableBuilderParameters
 */

/**
 * @typedef AppealDetailsSummaryParameters
 * @property {string} appealSite
 * @property {string} localPlanningAuthority
 * @property {string} [appealSiteKey]
 * @property {string} [localPlanningAuthorityKey]
 */

/**
 *
 * @param {import('./appeal-details.types').Appeal} appealData
 * @returns {AppealDetailsSummaryParameters}
 */
export function mapAppealDetailsToAppealDetailsSummaryParameters(appealData) {
	return {
		appealSite: appealData.appealSite
			? addressToString({
					addressLine1: appealData.appealSite.addressLine1 || '',
					addressLine2: appealData.appealSite.addressLine2 || '',
					town: appealData.appealSite.town || '',
					county: appealData.appealSite.county || '',
					postCode: appealData.appealSite.postCode || ''
			  })
			: 'Address not known',
		localPlanningAuthority: appealData.localPlanningDepartment
	};
}

/**
 *
 * @param {import('@pins/express').Session} session
 * @returns {import('./appellant-case/appellant-case.mapper.js').NotificationBannerComponentParameters[]}
 */
export function mapSessionDataToNotificationBannerParameters(session) {
	const notificationBanners = [];

	if (session.siteVisitTypeSelected) {
		notificationBanners.push({
			titleText: 'Success',
			titleHeadingLevel: 3,
			type: 'success',
			text: 'Site visit type has been selected'
		});

		delete session.siteVisitTypeSelected;
	}

	return notificationBanners;
}

/**
 *
 * @param {import('./appeal-details.types').Appeal} appealData
 * @returns {Object<string, SummaryListBuilderParameters>}
 */
export function mapAppealDetailsToSummaryListBuilderParameters(appealData) {
	const mappedCaseOverview = mapCaseOverview(appealData);
	const mappedCaseTimetable = mapCaseTimetable(appealData);
	const mappedCaseTeam = mapCaseTeam(appealData);
	const mappedSiteDetails = mapSiteDetails(appealData);

	return {
		caseOverview: mappedCaseOverview,
		siteDetails: mappedSiteDetails,
		...(mappedCaseTimetable && {
			caseTimetable: mappedCaseTimetable
		}),
		caseTeam: mappedCaseTeam
	};
}

/**
 *
 * @param {import('./appeal-details.types').Appeal} appealData
 * @returns {Object<string, TableBuilderParameters>}
 */
export function mapAppealDetailsToTableBuilderParameters(appealData) {
	const mappedCaseDocumentation = mapCaseDocumentation(appealData);

	return {
		caseDocumentation: mappedCaseDocumentation
	};
}

/**
 *
 * @param {import('./appeal-details.types').Appeal} appealDetails
 * @returns {SummaryListBuilderParameters}
 */
function mapCaseOverview(appealDetails) {
	return {
		rows: [
			{
				title: 'Appeal type',
				value: appealDetails.appealType || '',
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Case procedure',
				value: appealDetails.procedureType || '',
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Appellant name',
				value: appealDetails.appellantName || 'No appellant for this appeal',
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Agent name',
				value: appealDetails.agentName || 'No agent for this appeal',
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Linked appeals',
				value: appealDetails.linkedAppeals.map((linkedAppeal) => {
					const linkedAppealReferenceFragments = linkedAppeal.appealReference.split('/');
					return {
						title:
							linkedAppealReferenceFragments?.[linkedAppealReferenceFragments.length - 1] || '',
						href: `/appeals-service/appeal-details/${linkedAppeal.appealId}`
					};
				}),
				valueType: 'link',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Other appeals',
				value: appealDetails.otherAppeals.map((otherAppeal) => {
					const otherAppealReferenceFragments = otherAppeal.appealReference.split('/');
					return {
						title: otherAppealReferenceFragments?.[otherAppealReferenceFragments.length - 1] || '',
						href: `/appeals-service/appeal-details/${otherAppeal.appealId}`
					};
				}),
				valueType: 'link',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Allocation details',
				value: appealDetails.allocationDetails || 'No allocation details for this appeal',
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'LPA Reference',
				value: appealDetails.planningApplicationReference || 'No LPA reference for this appeal',
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Decision',
				value: appealDetails.decision || 'Not issued yet',
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			}
		]
	};
}

/**
 *
 * @param {import('./appeal-details.types').Appeal} appealDetails
 * @returns {SummaryListBuilderParameters|undefined}
 */
function mapCaseTimetable(appealDetails) {
	if (!appealDetails.startedAt) {
		return;
	}

	return {
		rows: [
			{
				title: 'Start date',
				value: dateToDisplayDate(appealDetails.startedAt),
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'LPA Questionnaire due',
				value: dateToDisplayDate(appealDetails.appealTimetable?.lpaQuestionnaireDueDate),
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Statement review due',
				value: dateToDisplayDate(appealDetails.appealTimetable?.statementReviewDate),
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Final comment review due',
				value: dateToDisplayDate(appealDetails.appealTimetable?.finalCommentReviewDate),
				valueType: 'text',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Site visit',
				value: appealDetails.siteVisit?.visitDate
					? dateToDisplayDate(appealDetails.siteVisit?.visitDate)
					: 'Not scheduled',
				valueType: 'text',
				actionText: appealDetails.siteVisit?.visitDate ? 'Change' : 'Schedule',
				actionLink: `/appeals-service/appeal-details/${appealDetails.appealId}/site-visit/schedule-visit`
			}
		]
	};
}

/**
 *
 * @param {import('./appeal-details.types').Appeal} appealDetails
 * @returns {TableBuilderParameters}
 */
function mapCaseDocumentation(appealDetails) {
	return {
		headings: ['Documentation', 'Status', 'Due date', 'Action'],
		rows: [
			[
				'Appellant case',
				mapDocumentStatus(appealDetails.documentationSummary?.appellantCase?.status),
				dateToDisplayDate(appealDetails.documentationSummary?.appellantCase?.dueDate),
				appealDetails.documentationSummary?.appellantCase?.status !== 'not_received'
					? `<a href="/appeals-service/appeal-details/${appealDetails.appealId}/appellant-case" class="govuk-link">Review</a>`
					: ''
			],
			[
				'LPA Questionnaire',
				mapDocumentStatus(appealDetails.documentationSummary?.lpaQuestionnaire?.status),
				dateToDisplayDate(appealDetails.documentationSummary?.lpaQuestionnaire?.dueDate),
				appealDetails.documentationSummary?.lpaQuestionnaire?.status !== 'not_received'
					? `<a href="/appeals-service/appeal-details/${appealDetails.appealId}/lpa-questionnaire/${appealDetails.lpaQuestionnaireId}" class="govuk-link">Review</a>`
					: ''
			]
		],
		firstCellIsHeader: true
	};
}

/**
 * @param {import('./appeal-details.types').DocumentStatus | undefined} status
 * @returns {string}
 */
function mapDocumentStatus(status) {
	switch (status?.toLowerCase()) {
		case 'received':
			return 'Received';
		case 'not_received':
			return 'Not received';
		case 'invalid':
			return 'Invalid';
		case 'incomplete':
			return 'Incomplete';
		case 'valid':
			return 'Valid';
		case 'complete':
			return 'Complete';
		default:
			return '';
	}
}

/**
 *
 * @param {import('./appeal-details.types').Appeal} appealDetails
 * @returns {SummaryListBuilderParameters}
 */
function mapCaseTeam(appealDetails) {
	return {
		rows: [
			{
				title: 'Case officer',
				value: appealDetails.caseOfficer
					? [
							appealDetails.caseOfficer?.name,
							appealDetails.caseOfficer?.email,
							appealDetails.caseOfficer?.phone
					  ]
					: 'No project members have been added yet',
				valueType: 'text',
				actionText: appealDetails.caseOfficer ? 'Change' : 'Add',
				actionLink: '#'
			},
			{
				title: 'Inspector',
				value: appealDetails.inspector
					? [
							appealDetails.inspector?.name,
							appealDetails.inspector?.email,
							appealDetails.inspector?.phone
					  ]
					: 'No project members have been added yet',
				valueType: 'text',
				actionText: appealDetails.inspector ? 'Change' : 'Add',
				actionLink: '#'
			}
		]
	};
}

/**
 *
 * @param {import('./appeal-details.types').Appeal} appealDetails
 * @returns {SummaryListBuilderParameters}
 */
function mapSiteDetails(appealDetails) {
	/**
	 * @type {import('../../lib/nunjucks-template-builders/summary-list-builder.js').HtmlTagType}
	 */
	const valueTypeText = 'text';

	const neighbourAddressRows = appealDetails.neighbouringSite?.contacts?.map((contact, index) => ({
		title: `Neighbour address ${index + 1}`,
		value: addressToString({
			addressLine1: contact.address?.addressLine1 || '',
			addressLine2: contact.address?.addressLine2 || '',
			town: contact.address?.town || '',
			county: contact.address?.county || '',
			postCode: contact.address?.postCode || ''
		}),
		valueType: valueTypeText,
		actionText: 'Change',
		actionLink: '#'
	}));

	return {
		rows: [
			{
				title: `Inspector access (LPA's answer)`,
				value: convertFromBooleanToYesNoWithOptionalDetails(
					appealDetails.inspectorAccess?.lpaQuestionnaire?.isRequired,
					appealDetails.inspectorAccess?.lpaQuestionnaire?.details || 'No details provided'
				),
				valueType: valueTypeText,
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: `Inspector access (appellant's answer)`,
				value: convertFromBooleanToYesNoWithOptionalDetails(
					appealDetails.inspectorAccess?.appellantCase?.isRequired,
					appealDetails.inspectorAccess?.appellantCase?.details || 'No details provided'
				),
				valueType: valueTypeText,
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Could a neighbouring site be affected?',
				value: convertFromBooleanToYesNoWithOptionalDetails(
					appealDetails.neighbouringSite.isAffected
				),
				valueType: valueTypeText,
				actionText: 'Change',
				actionLink: '#'
			},
			...(neighbourAddressRows || []),
			{
				title: `Potential safety risks (LPA's answer)`,
				value: convertFromBooleanToYesNoWithOptionalDetails(
					appealDetails.healthAndSafety?.lpaQuestionnaire?.hasIssues,
					appealDetails.healthAndSafety?.lpaQuestionnaire?.details || 'No details provided'
				),
				valueType: valueTypeText,
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: `Potential safety risks (appellant's answer)`,
				value: convertFromBooleanToYesNoWithOptionalDetails(
					appealDetails.healthAndSafety?.appellantCase?.hasIssues,
					appealDetails.healthAndSafety?.appellantCase?.details || 'No details provided'
				),
				valueType: valueTypeText,
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Visit type',
				value: appealDetails.siteVisit?.visitType
					? appealDetails.siteVisit?.visitType
					: 'Not selected',
				valueType: valueTypeText,
				actionText: 'Change',
				actionLink: '#'
			}
		]
	};
}
