import logger from '#lib/logger.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { appealSiteToAddressString } from '#lib/address-formatter.js';
import { nameToString } from '#lib/person-name-formatter.js';
import { getAppealTypesFromId } from './change-appeal-type.service.js';

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
 * @returns {PageContent}
 */
export function appealTypePage(appealDetails, appealTypes, changeAppeal) {
	/** @type {PageComponent} */
	const selectAppealTypeRadiosComponent = {
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
		pageComponents: [selectAppealTypeRadiosComponent]
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
			text: mapAppealTypeToDisplayText(appealType),
			checked: changeAppeal && changeAppeal.appealTypeId === appealType.id
		}));
}

/**
 *
 * @param {Appeal} appealDetails
 * @param { ChangeAppealTypeRequest } changeAppeal
 * @returns {PageContent}
 */
export function resubmitAppealPage(appealDetails, changeAppeal) {
	/** @type {PageComponent} */
	const selectResubmitAppealComponent = {
		type: 'radios',
		parameters: {
			name: 'appealResubmit',
			fieldset: {
				legend: {
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
		pageComponents: [selectResubmitAppealComponent]
	};

	return pageContent;
}

/**
 * @param {Appeal} appealDetails
 * @returns {PageContent}
 */
export function addHorizonReferencePage(appealDetails) {
	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `What is the reference of the new appeal on Horizon? - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'What is the reference of the new appeal on Horizon?',
		pageComponents: [
			{
				type: 'input',
				parameters: {
					id: 'horizon-reference',
					name: 'horizon-reference',
					type: 'text',
					classes: 'govuk-input govuk-input--width-10',
					label: {
						isPageHeading: false,
						text: 'Horizon reference',
						classes: 'govuk-visually-hidden'
					}
				}
			}
		]
	};

	return pageContent;
}

/**
 * @param {import('got').Got} apiClient
 * @param {Appeal} appealDetails
 * @param {string} transferredAppealHorizonReference
 * @returns {Promise<PageContent>}
 */
export async function checkTransferPage(
	apiClient,
	appealDetails,
	transferredAppealHorizonReference
) {
	const shortAppealReference = appealShortReference(appealDetails.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Details of the transferred appeal - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealDetails.appealId}/change-appeal-type/add-horizon-reference`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Details of the transferred appeal',
		pageComponents: [
			{
				type: 'summary-list',
				parameters: {
					rows: [
						{
							key: {
								text: 'Appeal reference'
							},
							value: {
								text: transferredAppealHorizonReference || ''
							}
						},
						{
							key: {
								text: 'Appeal type'
							},
							value: {
								text: await mapAppealResubmitTypeIdToAppealType(apiClient, appealDetails)
							}
						},
						{
							key: {
								text: 'Site address'
							},
							value: {
								text: appealSiteToAddressString(appealDetails.appealSite)
							}
						},
						{
							key: {
								text: 'Local planning authority'
							},
							value: {
								text: appealDetails.localPlanningDepartment
							}
						},
						{
							key: {
								text: 'Appellant name'
							},
							value: {
								text: nameToString({
									firstName: appealDetails.appellant?.firstName || '',
									lastName: appealDetails.appellant?.lastName || ''
								})
							}
						},
						{
							key: {
								text: 'Agent name'
							},
							value: {
								text: nameToString({
									firstName: appealDetails.agent?.firstName || '',
									lastName: appealDetails.agent?.lastName || ''
								})
							}
						}
					]
				}
			},
			{
				type: 'warning-text',
				parameters: {
					text: 'You must email the appellant to let them know the appeal type has been changed.'
				}
			},
			{
				type: 'checkboxes',
				parameters: {
					name: 'confirm',
					classes: 'govuk-checkboxes--small',
					items: [
						{
							text: 'I have emailed the appellant about their change of appeal type',
							value: 'yes',
							checked: false
						}
					]
				}
			}
		]
	};

	return pageContent;
}

/**
 * @param {import('got').Got} apiClient
 * @param {Appeal} appealDetails
 * @returns {Promise<string>}
 */
async function mapAppealResubmitTypeIdToAppealType(apiClient, appealDetails) {
	if (!('resubmitTypeId' in appealDetails)) {
		return '';
	}

	try {
		const appealTypes = await getAppealTypesFromId(apiClient, appealDetails.appealId);
		const appealType = appealTypes.find(
			(appealType) => appealType.id === appealDetails.resubmitTypeId
		);

		if (appealType) {
			return mapAppealTypeToDisplayText(appealType);
		}

		return '';
	} catch (error) {
		logger.error(error);
		return '';
	}
}

/**
 * @param {AppealType} appealType
 * @returns
 */
function mapAppealTypeToDisplayText(appealType) {
	return `(${appealType.code}) ${appealType.type}`;
}

/**
 *
 * @param {Appeal} appealDetails
 * @param { number } changeDay
 * @param { number } changeMonth
 * @param { number } changeYear
 * @returns {PageContent}
 */
export function changeAppealFinalDatePage(appealDetails, changeDay, changeMonth, changeYear) {
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
