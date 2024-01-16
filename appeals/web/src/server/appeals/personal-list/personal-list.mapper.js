import config from '#environment/config.js';
import { removeActions } from '#lib/mappers/mapper-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';
import { dateToDisplayDate } from '#lib/dates.js';
import { numberToAccessibleDigitLabel } from '#lib/accessibility.js';
import * as authSession from '../../app/auth/auth-session.service.js';

/** @typedef {import('@pins/appeals').AppealList} AppealList */
/** @typedef {import('@pins/appeals').Pagination} Pagination */
/** @typedef {import('../../app/auth/auth.service').AccountInfo} AccountInfo */

/**
 * @param {AppealList|void} appealsAssignedToCurrentUser
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @returns {PageContent}
 */
export function personalListPage(appealsAssignedToCurrentUser, session) {
	const account = /** @type {AccountInfo} */ (authSession.getAccount(session));
	const userGroups = account?.idTokenClaims?.groups ?? [];
	const isInspector = userGroups.includes(config.referenceData.appeals.inspectorGroupId);

	/** @type {PageContent} */
	const pageContent = {
		title: 'Personal list',
		heading: 'Cases assigned to you',
		headingClasses: 'govuk-heading-l govuk-!-margin-bottom-6',
		pageComponents: [
			{
				type: 'table',
				parameters: {
					head: [
						{
							text: 'Appeal ID'
						},
						{
							text: 'Lead or child'
						},
						{
							text: 'Action required'
						},
						{
							text: 'Due by'
						},
						{
							text: 'Case status'
						}
					],
					rows: (appealsAssignedToCurrentUser?.items || []).map((appeal) => {
						const shortReference = appealShortReference(appeal.appealReference);
						return [
							{
								html: `<strong><a class="govuk-link" href="/appeals-service/appeal-details/${
									appeal.appealId
								}" aria-label="Appeal ${numberToAccessibleDigitLabel(
									shortReference || ''
								)}">${shortReference}</a></strong>`
							},
							{
								html: '',
								pageComponents: [
									{
										type: 'status-tag',
										parameters: {
											status: ''
										}
									}
								]
							},
							{
								html: mapAppealStatusToActionRequiredHtml(
									appeal.appealId,
									appeal.appealStatus,
									appeal.lpaQuestionnaireId,
									appeal.documentationSummary?.appellantCase?.status,
									appeal.documentationSummary?.lpaQuestionnaire?.status,
									isInspector
								)
							},
							{
								text: dateToDisplayDate(appeal.dueDate) || ''
							},
							{
								html: '',
								pageComponents: [
									{
										type: 'status-tag',
										parameters: {
											status: appeal.appealStatus || 'ERROR'
										}
									}
								]
							}
						];
					})
				}
			}
		]
	};

	if (
		!session.account.idTokenClaims.groups.includes(config.referenceData.appeals.caseOfficerGroupId)
	) {
		pageContent.pageComponents?.forEach((component) => {
			if ('rows' in component.parameters && Array.isArray(component.parameters.rows)) {
				component.parameters.rows = component.parameters.rows.map((row) => removeActions(row));
			}
		});
	}

	if (pageContent.pageComponents) {
		preRenderPageComponents(pageContent.pageComponents);
	}

	return pageContent;
}

/**
 * @param {number} appealId
 * @param {string} appealStatus
 * @param {number|null|undefined} lpaQuestionnaireId
 * @param {string} appellantCaseStatus
 * @param {string} lpaQuestionnaireStatus
 * @param {boolean} [isInspector]
 * @returns {string}
 */
export function mapAppealStatusToActionRequiredHtml(
	appealId,
	appealStatus,
	lpaQuestionnaireId,
	appellantCaseStatus,
	lpaQuestionnaireStatus,
	isInspector = false
) {
	switch (appealStatus) {
		case 'ready_to_start':
		case 'review_appellant_case':
			if (appellantCaseStatus == 'Incomplete') {
				if (isInspector) {
					return 'Awaiting appellant update';
				}
				return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/appellant-case">Awaiting appellant update</a>`;
			}
			return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/appellant-case">Review appellant case</a>`;
		case 'lpa_questionnaire_due':
			if (!lpaQuestionnaireId) {
				return 'Awaiting LPA Questionnaire';
			}
			if (lpaQuestionnaireStatus == 'Incomplete') {
				if (isInspector) {
					return 'Awaiting LPA update';
				}
				return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}">Awaiting LPA update</a>`;
			}
			return 'LPA Questionnaire Overdue';
		case 'issue_determination':
			return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/issue-decision/decision">Submit decision</a>`;
		default:
			return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}">View appellant case</a>`;
	}
}
