import { addressToString } from '#lib/address-formatter.js';

/**
 * @typedef {import('../appeal-details.types.js').WebAppeal} Appeal
 * @typedef {import('@pins/appeals.api').Appeals.NotValidReasonOption} NotValidReasonOption
 * @typedef {import('../../appeals.types.js').SelectItemParameter} SelectItemParameter
 */

/**
 *
 * @param {Appeal} appealData
 * @param {string} appealReferenceInputValue
 * @returns {Promise<PageContent>}
 */
export async function addOtherAppealsPage(appealData, appealReferenceInputValue) {
	/** @type {PageComponent[]} */
	const addOtherAppealsPageContent = [
		{
			type: 'html',
			parameters: {
				html: `<form method="POST">`
			}
		},
		{
			type: 'input',
			parameters: {
				id: 'addOtherAppealsReference',
				name: 'addOtherAppealsReference',
				classes: 'govuk-input--width-10',
				value: appealReferenceInputValue
			}
		},

		{
			type: 'button',
			parameters: {
				id: 'filters-submit',
				type: 'submit',
				classes: 'govuk-button',
				text: 'Continue'
			}
		},
		{
			type: 'html',
			parameters: {
				html: '</form>'
			}
		}
	];

	/** @type {PageContent} */
	const pageContent = {
		title: `Add related appeal - ${appealData.appealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}`,
		preHeading: `Appeal ${appealData.appealReference}`,
		heading: 'What is the appeal reference?',
		pageComponents: [...addOtherAppealsPageContent]
	};

	return pageContent;
}

/**
 * @param {Appeal} currentAppeal
 * @param {import('@pins/appeals.api/src/server/endpoints/appeals.js').LinkableAppealSummary} relatedAppeal
 * @returns {PageContent}
 */
export function confirmOtherAppealsPage(currentAppeal, relatedAppeal) {
	const relateAppealsAnswer = '';
	/** @type {PageComponent[]} */
	const pageComponents = [
		{
			type: 'table',
			wrapperHtml: {
				opening:
					'<div class="govuk-grid-row"><div class="govuk-grid-column-full govuk-!-margin-top-5 govuk-!-margin-bottom-6">',
				closing: '</div></div>'
			},
			parameters: {
				firstCellIsHeader: false,
				rows: [
					[
						{
							html: '<strong>Appeal reference</strong>'
						},
						{
							html: `${relatedAppeal.appealReference}${
								relatedAppeal.source === 'horizon' ? ' (Horizon)' : ''
							}`
						}
					],
					[
						{
							html: '<strong>Appeal type</strong>'
						},
						{
							html: relatedAppeal.appealType || ''
						}
					],
					[
						{
							html: '<strong>Site address</strong>'
						},
						{
							html: relatedAppeal.siteAddress ? addressToString(relatedAppeal.siteAddress) : ''
						}
					],
					[
						{
							html: '<strong>Local planning authority</strong>'
						},
						{
							html: relatedAppeal.localPlanningDepartment || ''
						}
					],
					[
						{
							html: '<strong>Appellant name</strong>'
						},
						{
							html: relatedAppeal.appellantName || ''
						}
					],
					[
						{
							html: '<strong>Agent name</strong>'
						},
						{
							html: relatedAppeal.agentName || ''
						}
					]
				]
			}
		}
	];

	const relatedAppealIsCurrentAppeal =
		currentAppeal.appealReference === relatedAppeal.appealReference;
	const appealsAlreadyRelated =
		currentAppeal.otherAppeals.filter(
			(otherAppeal) => otherAppeal.appealReference === relatedAppeal.appealReference
		).length > 0;

	if (relatedAppealIsCurrentAppeal) {
		pageComponents.unshift({
			type: 'warning-text',
			parameters: {
				text: 'You cannot relate an appeal to itself.'
			}
		});
	} else if (appealsAlreadyRelated) {
		pageComponents.unshift({
			type: 'warning-text',
			parameters: {
				text: 'The appeals are already related.'
			}
		});
	} else {
		pageComponents.push({
			type: 'radios',
			parameters: {
				name: 'relateAppealsAnswer',
				id: 'relateAppealsAnswer',
				fieldset: {
					legend: {
						text: 'Do you want to relate these appeals?',
						classes: 'govuk-fieldset__legend--m'
					}
				},
				value: relateAppealsAnswer || null,
				items: [
					{
						value: 'yes',
						text: `Yes, relate this appeal to ${currentAppeal.appealReference}`
					},
					{
						value: 'no',
						text: `No, return to search`
					}
				]
			}
		});
	}

	/** @type {PageContent} */
	const pageContent = {
		title: `Related appeal details - ${currentAppeal.appealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${currentAppeal.appealId}/other-appeals/add`,
		preHeading: `Appeal ${currentAppeal.appealReference}`,
		heading: 'Related appeal details',
		submitButtonProperties:
			relatedAppealIsCurrentAppeal || appealsAlreadyRelated
				? {
						text: 'Return to search',
						href: `/appeals-service/appeal-details/${currentAppeal.appealId}/other-appeals/add`
				  }
				: {
						text: 'Continue'
				  },
		pageComponents
	};

	return pageContent;
}
