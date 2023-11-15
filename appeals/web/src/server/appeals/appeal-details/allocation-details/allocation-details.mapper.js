/**
 * @typedef {import("../../../lib/nunjucks-template-builders/summary-list-builder.js").BuilderParameters} SummaryListBuilderParameters
 * @typedef {import("./allocation-details.service.js").AllocationDetailsLevel} AllocationDetailsLevel
 * @typedef {import("./allocation-details.service.js").AllocationDetailsSpecialism} AllocationDetailsSpecialism
 */

export const backLink = (/** @type {import("../appeal-details.types.js").Appeal} */ appeal) => {
	return {
		text: 'Back to case details',
		link: `/appeals-service/appeal-details/${appeal.appealId}`
	};
};
export const pageHeading = 'Select the allocation level';

/**
 * @param {{ allocationDetailsLevels: AllocationDetailsLevel[] }} allocationDetailsData
 * @param { string | undefined } selectedAllocationLevel
 * @returns {PageComponent[]}
 */
export function allocationDetailsLevelPage(allocationDetailsData, selectedAllocationLevel) {
	/** @type {PageComponent[]} */
	const pageComponents = [
		{
			type: 'radios',
			wrapperHtml: {
				opening: '<div class="govuk-!-margin-top-8">',
				closing: '</div>'
			},
			parameters: {
				name: 'allocation-level',
				id: 'allocation-level',
				fieldset: {
					legend: {
						text: '',
						isPageHeading: false
					}
				},
				value: selectedAllocationLevel || null,
				items: allocationDetailsData.allocationDetailsLevels.map((item) => ({
					value: item.level,
					text: item.level
				}))
			}
		}
	];

	return pageComponents;
}

/**
 * @param {{ allocationDetailsLevels: AllocationDetailsLevel[]; allocationDetailsSpecialisms: AllocationDetailsSpecialism[]; }} allocationDetailsData
 * @param { AllocationDetailsLevel | undefined } selectedAllocationLevel
 * @param { number[] } selectedAllocationSpecialisms
 * @returns {PageComponent[]}
 */
export function allocationDetailsSpecialismPage(
	allocationDetailsData,
	selectedAllocationLevel,
	selectedAllocationSpecialisms
) {
	/** @type {PageComponent[]} */
	const pageComponents = [
		{
			type: 'table',
			wrapperHtml: {
				opening: '<div class="govuk-grid-row"><div class="govuk-grid-column-two-thirds govuk-!-padding-0 govuk-!-margin-top-5 govuk-!-margin-bottom-6">',
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
					checked: selectedAllocationSpecialisms && selectedAllocationSpecialisms.includes(item.id)
				}))
			}
		}
	];

	return pageComponents;
}

/**
 * @param { AllocationDetailsLevel } selectedAllocationLevel
 * @param { number[] } selectedAllocationSpecialisms
 * @param { number } appealId
 * @returns {PageComponent[]}
 */
export function allocationDetailsCheckAnswersPage(
	appealId,
	selectedAllocationLevel,
	selectedAllocationSpecialisms
) {
	const selectedAllocationSpecialismsHtml = selectedAllocationSpecialisms
		.map((selectedAllocationSpecialism) => `<li>${selectedAllocationSpecialism}</li>`)
		.join('');

	/** @type {PageComponent[]} */
	const pageComponents = [
		{
			type: 'table',
			wrapperHtml: {
				opening: '<div class="govuk-grid-row"><div class="govuk-grid-column-two-thirds">',
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
							html: `<a href="/appeals-service/appeal-details/${appealId}/allocation-details/allocation-level">Change</a>`
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
							html: `<a href="/appeals-service/appeal-details/${appealId}/allocation-details/allocation-specialism">Change</a>`
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
	];

	return pageComponents;
}
