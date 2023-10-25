import * as displayPageFormatter from '#lib/display-page-formatter.js';

/**
 *
 * @param {string} pageTitle
 * @param {import('@pins/appeals').AppealSite} appealSite
 * @returns {import('./appeal.mapper.js').InputInstruction[]}
 */
export function mapAddressInput(pageTitle, appealSite) {
	return [
		{
			type: 'field-set',
			legend: {
				text: pageTitle,
				isPageHeading: true,
				classes: 'govuk-fieldset__legend--l'
			}
		},
		{
			type: 'text-input',
			id: 'address-line-1',
			name: 'addressLine1',
			value: displayPageFormatter.nullToEmptyString(appealSite.addressLine1),
			label: {
				text: 'Address Line 1',
				isPageHeading: false
			}
		},
		{
			type: 'text-input',
			id: 'address-line-2',
			name: 'addressLine2',
			value: displayPageFormatter.nullToEmptyString(appealSite.addressLine2),
			label: {
				text: 'Address Line 2',
				isPageHeading: false
			}
		},
		{
			type: 'text-input',
			id: 'address-town',
			name: 'addressTown',
			value: displayPageFormatter.nullToEmptyString(appealSite.town),
			label: {
				text: 'Town',
				isPageHeading: false
			}
		},
		{
			type: 'text-input',
			id: 'address-county',
			name: 'addressCounty',
			value: displayPageFormatter.nullToEmptyString(appealSite.county),
			label: {
				text: 'County',
				isPageHeading: false
			}
		},
		{
			type: 'text-input',
			id: 'address-postcode',
			name: 'addressPostcode',
			value: displayPageFormatter.nullToEmptyString(appealSite.postCode),
			label: {
				text: 'Postcode',
				isPageHeading: false
			}
		}
	];
}

/**
 * @typedef {'textarea'} ConditionalTypes
 */

/**
 *
 * @param {string} id
 * @param {string} name
 * @param {string} hint
 * @param {string|undefined} details
 * @param {ConditionalTypes} [type]
 * @returns
 */
export function conditionalFormatter(id, name, hint, details, type = 'textarea') {
	let conditionalInputHtml = {
		textarea: `<textarea class="govuk-textarea" id="${id}" name="${name}" rows="3">${details}</textarea>`
		//TODO: Conditionals => add any new types here
	};
	return {
		html: `<div class="govuk-form-group">
		<label class="govuk-label" for="${id}">
			${hint}
		</label>
		${conditionalInputHtml[type]}
	  </div>`
	};
}
