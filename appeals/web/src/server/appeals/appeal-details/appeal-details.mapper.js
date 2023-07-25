import { addressToString } from '../../lib/address-formatter.js';
import { dateToDisplayDate } from '../../lib/dates.js';

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
					postCode: appealData.appealSite.postCode || '',
					town: appealData.appealSite.town || ''
			  })
			: 'Address not known',
		localPlanningAuthority: appealData.localPlanningDepartment
	};
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

	return {
		caseOverview: mappedCaseOverview,
		caseTeam: mappedCaseTeam,
		...(mappedCaseTimetable && {
			caseTimetable: mappedCaseTimetable
		})
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
				value: appealDetails.linkedAppeals.map((linkedAppeal) => ({
					title: linkedAppeal.appealReference,
					href: `/appeals-service/appeal-details/${linkedAppeal.appealId}`
				})),
				valueType: 'link',
				actionText: 'Change',
				actionLink: '#'
			},
			{
				title: 'Other appeals',
				value: appealDetails.otherAppeals.map((otherAppeal) => ({
					title: otherAppeal.appealReference,
					href: `/appeals-service/appeal-details/${otherAppeal.appealId}`
				})),
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
				value: dateToDisplayDate(appealDetails.siteVisit?.visitDate),
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
				`<a href="/appeals-service/appeal-details/${appealDetails.appealId}/appellant-case" class="govuk-link">Review</a>`
			],
			[
				'LPA Questionnaire',
				mapDocumentStatus(appealDetails.documentationSummary?.lpaQuestionnaire?.status),
				dateToDisplayDate(appealDetails.documentationSummary?.lpaQuestionnaire?.dueDate),
				`<a href="/appeals-service/appeal-details/${appealDetails.appealId}/lpa-questionnaire-review/${appealDetails.lpaQuestionnaireId}" class="govuk-link">Review</a>`
			]
		]
	};
}

/**
 * @param {import('./appeal-details.types').DocumentStatus | undefined} status
 * @returns {string}
 */
function mapDocumentStatus(status) {
	switch (status) {
		case 'received':
			return 'Received';
		case 'not_received':
			return 'Not received';
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
