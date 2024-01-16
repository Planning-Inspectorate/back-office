import { surnameFirstToFullName } from '#lib/person-name-formatter.js';
import usersService from '../../appeal-users/users-service.js';
import config from '#environment/config.js';
import { appealShortReference } from '#lib/appeals-formatter.js';

/** @typedef {import('../../../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */

/**
 * @param {import('../appeal-details.types.js').WebAppeal} appealDetails
 * @param {boolean} isInspector
 * @param {boolean} searchPerformed
 * @param {string|undefined} searchTerm
 * @param {Object<string, any>[]} searchResults
 * @param {string|null|undefined} assignedUserId
 * @param {SessionWithAuth} session
 * @returns {Promise<PageContent>}
 */
export async function assignUserPage(
	appealDetails,
	isInspector,
	searchPerformed,
	searchTerm,
	searchResults,
	assignedUserId,
	session
) {
	const userTypeRoute = isInspector ? 'inspector' : 'case-officer';
	const userTypeText = isInspector ? 'inspector' : 'case officer';
	const userTypeArticle = isInspector
		? `${assignedUserId ? 'a new' : 'an'}`
		: `a${assignedUserId ? ' new' : ''}`;
	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageComponentGroup} */
	const searchInputComponentGroup = {
		wrapperHtml: {
			opening:
				'<form name="assignUserSearch" method="post" novalidate="novalidate" class="govuk-!-margin-bottom-5">',
			closing: '</form>'
		},
		pageComponents: [
			{
				type: 'input',
				parameters: {
					id: 'searchTerm',
					name: 'searchTerm',
					label: {
						text: 'Search by name or email. A first name or surname may be enough to find the correct person.',
						classes: 'govuk-caption-m govuk-!-margin-bottom-3 colour--secondary'
					},
					value: searchTerm || ''
				}
			},
			{
				type: 'button',
				parameters: {
					text: 'Search'
				}
			}
		]
	};

	/** @type {PageComponentGroup} */
	const searchResultsComponentGroup = {
		wrapperHtml: {
			opening: `<div class="govuk-grid-row"><div class="govuk-grid-column-full govuk-!-margin-bottom-5"><h2 class="govuk-heading-m">Search results</h2><p class="govuk-body">Matches for <strong>${searchTerm}</strong></p>`,
			closing: '</div></div>'
		},
		pageComponents: [
			{
				type: 'summary-list',
				parameters: {
					rows: searchResults.map((result) => ({
						key: {
							text: result.name
						},
						value: {
							text: result.email
						},
						actions: {
							items: [
								{
									text: 'Choose',
									href: `/appeals-service/appeal-details/${appealDetails.appealId}/assign-user/${userTypeRoute}/${result.id}/confirm`
								}
							]
						}
					}))
				}
			}
		]
	};

	/** @type {PageComponentGroup|undefined} */
	const currentAssigneeComponentGroup = await buildCurrentAssigneeComponentGroup(
		assignedUserId,
		appealDetails.appealId,
		isInspector,
		session,
		userTypeText
	);

	/** @type {PageContent} */
	const pageContent = {
		title: `Assign ${userTypeText} - ${shortAppealReference}`,
		backLinkText: 'Back',
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: `Find ${userTypeArticle} ${userTypeText}`,
		pageComponentGroups: [
			searchInputComponentGroup,
			...(searchPerformed ? [searchResultsComponentGroup] : []),
			...(currentAssigneeComponentGroup ? [currentAssigneeComponentGroup] : [])
		]
	};

	return pageContent;
}

/**
 * @param {string|null|undefined} assignedUserId
 * @param {number} appealId
 * @param {boolean} isInspector
 * @param {SessionWithAuth} session
 * @param {string} userTypeText
 * @returns {Promise<PageComponentGroup|undefined>}
 */
async function buildCurrentAssigneeComponentGroup(
	assignedUserId,
	appealId,
	isInspector,
	session,
	userTypeText
) {
	if (!assignedUserId) {
		return;
	}

	const user = await usersService.getUserByRoleAndId(
		isInspector
			? config.referenceData.appeals.inspectorGroupId
			: config.referenceData.appeals.caseOfficerGroupId,
		session,
		assignedUserId
	);

	if (!user) {
		return;
	}

	/** @type {PageComponentGroup} */
	const currentAssigneeComponentGroup = {
		wrapperHtml: {
			opening: `<h2 class="govuk-heading-s">Current ${userTypeText}</h2>`,
			closing: ''
		},
		pageComponents: [
			{
				type: 'summary-list',
				parameters: {
					rows: [
						{
							key: {
								text: surnameFirstToFullName(user.name)
							},
							value: {
								text: user.email
							},
							actions: {
								...(isInspector && {
									items: [
										{
											text: 'Remove',
											href: `/appeals-service/appeal-details/${appealId}/unassign-user/inspector/${assignedUserId}/confirm`
										}
									]
								})
							}
						}
					]
				}
			}
		]
	};

	return currentAssigneeComponentGroup;
}
