import { appealShortReference } from '#lib/appeals-formatter.js';
/**
 * @typedef {import('../appeal-details.types.js').WebAppeal} Appeal
 * @typedef {import('@pins/appeals.api').Appeals.NotValidReasonOption} NotValidReasonOption
 * @typedef {import('./change-appeal-type.types.js').AppealType} AppealType
 * @typedef {import('../../appeals.types.js').SelectItemParameter} SelectItemParameter
 * @typedef {import('./change-appeal-type.types.js').ChangeAppealTypeRequest} ChangeAppealTypeRequest
 */

/**
 *
 * @param {Appeal} appealDetails
 * @param {AppealType[]} appealTypes
 * @param { ChangeAppealTypeRequest } changeAppeal
 * @returns {Promise<PageContent>}
 */
export async function appealTypePage(appealDetails, appealTypes, changeAppeal) {
	/** @type {PageComponent} */
	const selectVisitTypeComponent = {
		type: 'radios',
		parameters: {
			name: 'appealType',
			fieldset: {
				legend: {
					classes: 'govuk-fieldset__legend--m'
				}
			},
			items: mapAppealTypesToSelectItemParameters(appealTypes, changeAppeal)
		}
	};

	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `What type should this appeal be? - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'What type should this appeal be?',
		pageComponents: [selectVisitTypeComponent]
	};

	return pageContent;
}

/**
 *
 * @param { AppealType[] } appealTypes
 * @param { ChangeAppealTypeRequest } changeAppeal
 * @returns { SelectItemParameter[]}
 */
export function mapAppealTypesToSelectItemParameters(appealTypes, changeAppeal) {
	return appealTypes
		.sort((a, b) => a.code.localeCompare(b.code))
		.map((appealType) => ({
			value: appealType.id.toString(),
			text: `(${appealType.code}) ${appealType.type}`,
			checked: changeAppeal && changeAppeal.appealTypeId === appealType.id
		}));
}

/**
 *
 * @param {Appeal} appealDetails
 * @param { ChangeAppealTypeRequest } changeAppeal
 * @returns {Promise<PageContent>}
 */
export async function resubmitAppealPage(appealDetails, changeAppeal) {
	/** @type {PageComponent} */
	const selectResubmitAppeaComponent = {
		type: 'radios',
		parameters: {
			name: 'appealResubmit',
			fieldset: {
				legend: {
					text: '',
					classes: 'govuk-fieldset__legend--m'
				}
			},
			items: [
				{
					value: true,
					text: 'Yes',
					checked: changeAppeal?.resubmit === true
				},
				{
					value: false,
					text: 'No',
					// Set checked to true if resubmit is false or undefined
					checked: changeAppeal?.resubmit === false || changeAppeal?.resubmit === undefined
				}
			]
		}
	};

	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Should the appellant be asked to resubmit this appeal? - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}/change-appeal-type/appeal-type`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Should the appellant be asked to resubmit this appeal?',
		pageComponents: [selectResubmitAppeaComponent]
	};

	return pageContent;
}

/**
 *
 * @param {Appeal} appealDetails
 * @param { number } changeDay
 * @param { number } changeMonth
 * @param { number } changeYear
 * @returns {Promise<PageContent>}
 */
export async function changeAppealFinalDatePage(appealDetails, changeDay, changeMonth, changeYear) {
	/** @type {PageComponent} */
	const selectDateComponent = {
		type: 'date-input',
		parameters: {
			id: 'change-appeal-final-date',
			namePrefix: 'change-appeal-final-date',
			fieldset: {
				legend: {
					text: '',
					classes: 'govuk-fieldset__legend--m'
				}
			},
			hint: {
				text: 'For example, 27 3 2023'
			},
			items: [
				{
					classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
					name: 'day',
					value: changeDay || ''
				},
				{
					classes: 'govuk-input govuk-date-input__input govuk-input--width-2',
					name: 'month',
					value: changeMonth || ''
				},
				{
					classes: 'govuk-input govuk-date-input__input govuk-input--width-4',
					name: 'year',
					value: changeYear || ''
				}
			]
		}
	};

	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `What is the final date the appellant must resubmit by? - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}/change-appeal-type/resubmit`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'What is the final date the appellant must resubmit by?',
		pageComponents: [selectDateComponent]
	};

	return pageContent;
}

/**
 *
 * @param {Appeal} appealData
 * @returns {ConfirmationPageContent}
 */
export function resubmitConfirmationPage(appealData) {
	/** @type {HtmlPageComponent} */
	const multiLinkComponent = {
		type: 'html',
		parameters: {
			html: `<p class="govuk-body">  You can go <a href="/appeals-service/appeals-list" class="govuk-link">back to your list</a> or <a href="/appeals-service/appeal-details/${appealData.appealId}" class="govuk-link">view the closed case</a>.</p>`
		}
	};

	/** @type {ConfirmationPageContent} */
	const confirmationPage = {
		pageTitle: 'Appeal closed',
		panel: {
			title: 'Appeal closed',
			appealReference: {
				label: 'Appeal reference',
				reference: appealData.appealReference
			}
		},
		body: {
			rows: [
				{
					text: 'The appellant has been emailled to ask them to resubmit their appeal with the correct type.'
				}
			]
		},
		pageComponents: [multiLinkComponent]
	};

	return confirmationPage;
}
