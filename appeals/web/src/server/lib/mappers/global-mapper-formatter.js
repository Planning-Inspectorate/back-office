import * as displayPageFormatter from '#lib/display-page-formatter.js';


/**
 * @typedef DisplayInstructions
 * Display Instructions
 * @type {object}
 * @property {SummaryListRowProperties} [summaryListItem] To create a row in a summary list
 * @property {StatusTagProperties} [statusTag] To create a Status Tag
 * @property {TableCellProperties[]} [tableItem] To create a table row
 */

/**
 * @typedef {Object} CheckboxesInputInstruction
 * @property {'checkboxes'} type
 * @property {CheckboxesProperties} properties
 */
/**
 * @typedef {Object} RadiosInputInstruction
 * @property {'radios'} type
 * @property {RadiosProperties} properties
 */
/**
 * @typedef {Object} InputInputInstruction
 * @property {'input'} type
 * @property {InputProperties} properties
 */
/**
 * @typedef {Object} FieldsetInputInstruction
 * @property {'fieldset'} type
 * @property {FieldsetProperties} properties
 */

/**
 * @typedef InputInstruction
 * @type {CheckboxesInputInstruction | RadiosInputInstruction | InputInputInstruction | FieldsetInputInstruction}
 */

/**
 * @typedef {Object} InputInstructions
 * @property {InputInstruction[]} instructions
 * @property {string} [displayName]
 */

/**
 * @param {InputInstruction} inputOption
 * @returns {inputOption is CheckboxesInputInstruction}
 */
export function inputInstructionIsCheckboxesInputInstruction(inputOption) {
    return inputOption.type === 'checkboxes';
}

/**
 * @param {InputInstruction} inputOption
 * @returns {inputOption is RadiosInputInstruction}
 */
export function inputInstructionIsRadiosInputInstruction(inputOption) {
    return inputOption.type === 'radios';
}

/**
 * @param {InputInstruction} inputOption
 * @returns {inputOption is InputInputInstruction}
 */
export function inputInstructionIsInputInputInstruction(inputOption) {
    return inputOption.type === 'input';
}

/**
 * @param {InputInstruction} inputOption
 * @returns {inputOption is FieldsetInputInstruction}
 */
export function inputInstructionIsFieldsetInputInstruction(inputOption) {
    return inputOption.type === 'fieldset';
}

/**
 * @typedef Instructions
 * A series of instructions pages where you display data, input data, and the API associated with that data
 * @type {object}
 * @property {string} id
 * @property {DisplayInstructions} display Collection of display instructions
 * TODO: move InputInstruction definition to a shared location
 * @property {InputInstructions} [input] Collection of input instructions
 * @property {string} [submitApi]
 * @property {string} [inputItemApi]
 */

/**
 * @typedef {Object<string, Instructions>} MappedInstructions
 */

/**
 *
 * @param {import('@pins/appeals.api').Appeals.AppealSite} appealSite
 * @returns {import('./lpaQuestionnaire.mapper.js').InputInstruction[]}
 */
export function mapAddressInput(appealSite) {
	return [
		{
			type: 'input',
			properties: {
				id: 'address-line-1',
				name: 'addressLine1',
				value: displayPageFormatter.nullToEmptyString(appealSite.addressLine1),
				label: {
					text: 'Address Line 1',
					isPageHeading: false
				}
			}
		},
		{
			type: 'input',
			properties: {
				id: 'address-line-2',
				name: 'addressLine2',
				value: displayPageFormatter.nullToEmptyString(appealSite.addressLine2),
				label: {
					text: 'Address Line 2',
					isPageHeading: false
				}
			}
		},
		{
			type: 'input',
			properties: {
				id: 'address-town',
				name: 'addressTown',
				value: displayPageFormatter.nullToEmptyString(appealSite.town),
				label: {
					text: 'Town',
					isPageHeading: false
				}
			}
		},
		{
			type: 'input',
			properties: {
				id: 'address-county',
				name: 'addressCounty',
				value: displayPageFormatter.nullToEmptyString(appealSite.county),
				label: {
					text: 'County',
					isPageHeading: false
				}
			}
		},
		{
			type: 'input',
			properties: {
				id: 'address-postcode',
				name: 'addressPostcode',
				value: displayPageFormatter.nullToEmptyString(appealSite.postCode),
				label: {
					text: 'Postcode',
					isPageHeading: false
				}
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

/**
 * @param {string} date
 * @param {string} [startTime]
 * @param {string} [endTime]
 */
export function dateAndTimeFormatter(date, startTime, endTime) {
	const to = endTime ? ` - ${endTime}` : '';
	const fromToListItem = startTime ? `<li>${startTime}${to}</li>` : '';
	return `<ul class="govuk-list govuk-!-margin-top-0 govuk-!-padding-left-0"><li>${date}</li>${fromToListItem}</ul>`;
}
