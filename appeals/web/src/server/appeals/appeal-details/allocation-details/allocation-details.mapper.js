import { appealShortReference } from '#lib/appeals-formatter.js';

/**
 * @typedef {import("./allocation-details.service.js").AllocationDetailsLevel} AllocationDetailsLevel
 * @typedef {import("./allocation-details.service.js").AllocationDetailsSpecialism} AllocationDetailsSpecialism
 * @typedef {import("../appeal-details.types.js").WebAppeal} Appeal
 */

/**
 * @param {{ allocationDetailsLevels: AllocationDetailsLevel[] }} allocationDetailsData
 * @param { string | undefined } selectedAllocationLevel
 * @param {Appeal} appealDetails
 * @returns {PageContent}
 */
export function allocationDetailsLevelPage(
	allocationDetailsData,
	selectedAllocationLevel,
	appealDetails
) {
	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Select the allocation level - ${shortAppealReference}`,
		backLinkText: 'Back to case details',
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Select the allocation level',
		pageComponents: [
			{
				type: 'radios',
				wrapperHtml: {
					opening: '<div class="govuk-!-margin-top-8">',
					closing: '</div>'
				},
				parameters: {
					name: 'allocation-level',
					id: 'allocation-level',
					value: selectedAllocationLevel || null,
					items: allocationDetailsData.allocationDetailsLevels.map((item) => ({
						value: item.level,
						text: item.level
					}))
				}
			}
		]
	};

	return pageContent;
}

/**
 * @param {{ allocationDetailsLevels: AllocationDetailsLevel[]; allocationDetailsSpecialisms: AllocationDetailsSpecialism[]; }} allocationDetailsData
 * @param { AllocationDetailsLevel | undefined } selectedAllocationLevel
 * @param { number[] } selectedAllocationSpecialisms
 * @param {Appeal} appealDetails
 * @returns {PageContent}
 */
export function allocationDetailsSpecialismPage(
	allocationDetailsData,
	selectedAllocationLevel,
	selectedAllocationSpecialisms,
	appealDetails
) {
	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Allocation specialism - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}/allocation-details/allocation-level`,
		backLinkText: 'Back',
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Allocation specialism',
		pageComponents: [
			{
				type: 'table',
				wrapperHtml: {
					opening:
						'<div class="govuk-grid-row"><div class="govuk-grid-column-two-thirds govuk-!-margin-top-5 govuk-!-margin-bottom-6">',
					closing: '</div></div>'
				},
				parameters: {
					firstCellIsHeader: false,
					rows: [
						[
							{
								html: '<strong>Level</strong>'
							},
							{
								html: selectedAllocationLevel && selectedAllocationLevel.level
							}
						],
						[
							{
								html: '<strong>Band</strong>'
							},
							{
								html: selectedAllocationLevel && selectedAllocationLevel.band
							}
						]
					]
				}
			},
			{
				type: 'checkboxes',
				parameters: {
					name: 'allocation-specialisms',
					classes: 'govuk-checkboxes--small',
					fieldset: {
						legend: {
							text: 'Select allocation specialism',
							isPageHeading: true,
							classes: 'govuk-fieldset__legend--m'
						}
					},
					items: allocationDetailsData.allocationDetailsSpecialisms.map((item) => ({
						text: item.name,
						value: item.id,
						checked:
							selectedAllocationSpecialisms && selectedAllocationSpecialisms.includes(item.id)
					}))
				}
			}
		]
	};

	return pageContent;
}

/**
 * @param { AllocationDetailsLevel } selectedAllocationLevel
 * @param { number[] } selectedAllocationSpecialisms
 * @param { Appeal } appealDetails
 * @returns {PageContent}
 */
export function allocationDetailsCheckAnswersPage(
	selectedAllocationLevel,
	selectedAllocationSpecialisms,
	appealDetails
) {
	const shortAppealReference = appealShortReference(appealDetails.appealReference);
	const selectedAllocationSpecialismsHtml = selectedAllocationSpecialisms
		.map((selectedAllocationSpecialism) => `<li>${selectedAllocationSpecialism}</li>`)
		.join('');

	/** @type {PageContent} */
	const pageContent = {
		title: `Check answers - ${shortAppealReference}`,
		backLinkText: 'Back',
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}/allocation-details/allocation-specialism`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Check answers',
		pageComponents: [
			{
				type: 'table',
				wrapperHtml: {
					opening:
						'<div class="govuk-grid-row"><div class="govuk-grid-column-two-thirds govuk-!-margin-top-5 govuk-!-margin-bottom-6">',
					closing: '</div></div>'
				},
				parameters: {
					firstCellIsHeader: false,
					rows: [
						[
							{
								html: '<strong>Level</strong>'
							},
							{
								html: selectedAllocationLevel.level
							},
							{
								html: `<a href="/appeals-service/appeal-details/${appealDetails.appealId}/allocation-details/allocation-level">Change</a>`
							}
						],
						[
							{
								html: '<strong>Band</strong>'
							},
							{
								html: selectedAllocationLevel.band
							},
							{
								text: ''
							}
						],
						[
							{
								html: '<strong>Specialism</strong>'
							},
							{
								html: `<ul class="govuk-!-padding-0 govuk-!-margin-0 govuk-!-margin-left-4">${selectedAllocationSpecialismsHtml}</ul>`
							},
							{
								html: `<a href="/appeals-service/appeal-details/${appealDetails.appealId}/allocation-details/allocation-specialism">Change</a>`
							}
						]
					]
				}
			},
			{
				type: 'button',
				wrapperHtml: {
					opening: '<form action="" method="POST" novalidate>',
					closing: '</form>'
				},
				parameters: {
					text: 'Confirm',
					type: 'submit'
				}
			}
		]
	};

	return pageContent;
}
