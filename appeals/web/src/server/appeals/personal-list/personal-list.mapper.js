import config from '#environment/config.js';
import { removeActions } from '#lib/mappers/mapper-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { preRenderPageComponents } from '#lib/nunjucks-template-builders/page-component-rendering.js';
import { dateToDisplayDate } from '#lib/dates.js';
import { numberToAccessibleDigitLabel } from '#lib/accessibility.js';

/** @typedef {import('@pins/appeals').AppealSummary} AppealSummary */
/** @typedef {import('@pins/appeals').AppealList} AppealList */
/** @typedef {import('@pins/appeals').Pagination} Pagination */

/**
 * @param {AppealSummary} appealListItem
 * @returns {appealListItem is AppealSummary}
 */
export function appealListItemIsAppealSummary(appealListItem) {
	const appealListItemKeys = Object.keys(appealListItem);

	return (
		appealListItemKeys.includes('appealId') &&
		appealListItemKeys.includes('appealReference') &&
		appealListItemKeys.includes('appealStatus') &&
		appealListItemKeys.includes('dueDate')
	);
}

/**
 * @param {AppealList|void} appealsAssignedToCurrentUser
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @returns {PageContent}
 */
export function personalListPage(appealsAssignedToCurrentUser, session) {
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
					rows: (appealsAssignedToCurrentUser?.items || [])
						.filter((appeal) => appeal !== null && 'appealId' in appeal)
						.filter(appealListItemIsAppealSummary)
						.map((appeal) => {
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
										appeal.lpaQuestionnaireId
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
 * @returns {string}
 */
function mapAppealStatusToActionRequiredHtml(appealId, appealStatus, lpaQuestionnaireId) {
	switch (appealStatus) {
		case 'ready_to_start':
		case 'review_appellant_case':
			return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/appellant-case">View appellant case</a>`;
		case 'lpa_questionnaire_due':
			if (!lpaQuestionnaireId) {
				return '';
			}
			return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}">View LPA Questionnaire</a>`;
		default:
			return `<a class="govuk-link" href="/appeals-service/appeal-details/${appealId}">View appeal</a>`;
	}
}
