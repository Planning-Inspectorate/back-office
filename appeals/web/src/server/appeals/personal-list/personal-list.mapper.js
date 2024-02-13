import config from '#environment/config.js';
import { removeActions } from '#lib/mappers/mapper-utilities.js';
import { appealShortReference, linkedAppealStatus } from '#lib/appeals-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';
import { dateToDisplayDate } from '#lib/dates.js';
import { numberToAccessibleDigitLabel } from '#lib/accessibility.js';
import * as authSession from '../../app/auth/auth-session.service.js';
import { appealStatusToStatusTag } from '#lib/nunjucks-filters/status-tag.js';
import { capitalizeFirstLetter } from '#lib/string-utilities.js';

/** @typedef {import('@pins/appeals').AppealList} AppealList */
/** @typedef {import('@pins/appeals').Pagination} Pagination */
/** @typedef {import('../../app/auth/auth.service').AccountInfo} AccountInfo */

/**
 * @param {AppealList|void} appealsAssignedToCurrentUser
 * @param {string} urlWithoutQuery
 * @param {string|undefined} appealStatusFilter
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @returns {PageContent}
 */

export function personalListPage(
	appealsAssignedToCurrentUser,
	urlWithoutQuery,
	appealStatusFilter,
	session
) {
	const account = /** @type {AccountInfo} */ (authSession.getAccount(session));
	const userGroups = account?.idTokenClaims?.groups ?? [];
	const isInspector = userGroups.includes(config.referenceData.appeals.inspectorGroupId);

	const filterItemsArray = ['all', ...(appealsAssignedToCurrentUser?.statuses || [])].map(
		(appealStatus) => ({
			text: capitalizeFirstLetter(appealStatusToStatusTag(appealStatus)),
			value: appealStatus,
			selected: appealStatusFilter === appealStatus
		})
	);

	/** @type {PageContent} */
	const pageContent = {
		title: 'Personal list',
		heading: 'Cases assigned to you',
		headingClasses: 'govuk-heading-l govuk-!-margin-bottom-6',
		pageComponents: [
			{
				type: 'details',
				parameters: {
					summaryText: 'Filters',
					html: '',
					pageComponents: [
						{
							type: 'html',
							parameters: {
								html: `<form method="GET">`
							}
						},
						{
							type: 'select',
							parameters: {
								label: {
									text: 'Show cases with status'
								},
								id: 'filters-select',
								name: 'appealStatusFilter',
								value: 'all',
								items: filterItemsArray
							}
						},
						{
							type: 'html',
							parameters: {
								html: '<div class="govuk-button-group">'
							}
						},
						{
							type: 'button',
							parameters: {
								id: 'filters-submit',
								type: 'submit',
								classes: 'govuk-button--secondary',
								text: 'Apply'
							}
						},
						{
							type: 'html',
							parameters: {
								html: `<a class="govuk-link" href="${urlWithoutQuery}">Clear filter</a></div></form>`
							}
						}
					]
				}
			},
			{
				type: 'table',
				parameters: {
					head: [
						{
							text: 'Appeal reference'
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
											status: linkedAppealStatus(appeal.isParentAppeal, appeal.isChildAppeal)
										}
									}
								]
							},
							{
								html: mapAppealStatusToActionRequiredHtml(
									appeal.appealId,
									appeal.appealStatus,
									appeal.lpaQuestionnaireId,
									appeal.appellantCaseStatus,
									appeal.lpaQuestionnaireStatus,
									appeal.dueDate,
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
 * @param {string} dueDate
 * @param {boolean} [isInspector]
 * @returns {string}
 */
export function mapAppealStatusToActionRequiredHtml(
	appealId,
	appealStatus,
	lpaQuestionnaireId,
	appellantCaseStatus,
	lpaQuestionnaireStatus,
	dueDate,
	isInspector = false
) {
	const currentDate = new Date();
	const appealDueDate = new Date(dueDate);

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
			if (currentDate > appealDueDate) {
				return 'LPA Questionnaire Overdue';
			}
			if (lpaQuestionnaireStatus == 'Incomplete') {
				if (isInspector) {
					return 'Awaiting LPA update';
				}
				return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}">Awaiting LPA update</a>`;
			}
			if (lpaQuestionnaireId) {
				if (isInspector) {
					return 'Review LPA Questionnaire';
				}
				return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}">Review LPA Questionnaire</a>`;
			}
			return 'Awaiting LPA Questionnaire';
		case 'issue_determination':
			return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/issue-decision/decision">Submit decision</a>`;
		case 'awaiting_transfer':
			return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/change-appeal-type/add-horizon-reference">Update Horizon reference</a>`;
		default:
			return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}">View appellant case</a>`;
	}
}
