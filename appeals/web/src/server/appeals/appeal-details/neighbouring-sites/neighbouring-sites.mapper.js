import { appealSiteToMultilineAddressStringHtml } from '#lib/address-formatter.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import {
	errorAddressLine1,
	errorPostcode,
	errorTown
} from '#lib/error-handlers/address-error-handler.js';

/**
 * @typedef {import('../appeal-details.types.js').WebAppeal} Appeal
 * @param {Appeal} appealData
 * @param {{addressLine1: any;addressLine2: any;town: any;county: any;postCode: any;}} currentAddress
 * @returns {PageContent}
 * @param {import("@pins/express").ValidationErrors | undefined} errors
 */
export function addNeighbouringSitePage(appealData, currentAddress, errors) {
	const shortAppealReference = appealShortReference(appealData.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: 'Add neighbouring site',
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Add neighbouring site',
		pageComponents: [
			{
				type: 'input',
				parameters: {
					id: 'address-line-1',
					name: 'addressLine1',
					type: 'text',
					label: {
						isPageHeading: false,
						text: 'Address line 1'
					},
					value: currentAddress?.addressLine1 ?? '',
					errorMessage: errorAddressLine1(errors)
				}
			},
			{
				type: 'input',
				parameters: {
					id: 'address-line-2',
					name: 'addressLine2',
					type: 'text',
					label: {
						isPageHeading: false,
						text: 'Address line 2 (optional)'
					},
					value: currentAddress?.addressLine2 ?? ''
				}
			},
			{
				type: 'input',
				parameters: {
					id: 'address-town',
					name: 'town',
					type: 'text',
					label: {
						isPageHeading: false,
						text: 'Town or city'
					},
					value: currentAddress?.town ?? '',
					errorMessage: errorTown(errors)
				}
			},
			{
				type: 'input',
				parameters: {
					id: 'address-county',
					name: 'county',
					type: 'text',
					label: {
						isPageHeading: false,
						text: 'County (optional)'
					},
					value: currentAddress?.county ?? ''
				}
			},
			{
				type: 'input',
				parameters: {
					id: 'address-postcode',
					name: 'postCode',
					type: 'text',
					classes: 'govuk-input govuk-input--width-10',
					label: {
						isPageHeading: false,
						text: 'Postcode'
					},
					value: currentAddress?.postCode ?? '',
					errorMessage: errorPostcode(errors)
				}
			}
		]
	};

	return pageContent;
}
/**
 *
 * @param {Appeal} appealData
 * @param {import('@pins/appeals.api').Appeals.AppealSite} neighbouringSiteData
 * @returns {PageContent}
 */
export function addNeighbouringSiteCheckAndConfirmPage(appealData, neighbouringSiteData) {
	const shortAppealReference = appealShortReference(appealData.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Details of neighbouring site you're adding to ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}/neighbouring-sites/add`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Check your answers',
		headingClasses: 'govuk-heading-l',
		pageComponents: [
			{
				type: 'summary-list',
				parameters: {
					classes: 'govuk-!-margin-bottom-9',
					rows: [
						{
							key: {
								text: 'Address'
							},
							value: {
								html: `${appealSiteToMultilineAddressStringHtml(neighbouringSiteData)}`
							},
							actions: {
								items: [
									{
										text: 'Change',
										href: `/appeals-service/appeal-details/${appealData.appealId}/neighbouring-sites/add`,
										visuallyHidden: 'Address'
									}
								]
							}
						}
					]
				}
			}
		]
	};

	return pageContent;
}
