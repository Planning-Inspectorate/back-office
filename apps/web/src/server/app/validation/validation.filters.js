import { capitalize } from 'lodash-es';

/** @typedef {import('@pins/validation').AppealOutcomeStatus} AppealOutcomeStatus */
/** @typedef {import('@pins/validation').IncompleteReasons} IncompleteReasons */
/** @typedef {import('@pins/validation').InvalidReasons} InvalidReasons */

/** @type {Record<keyof IncompleteReasons, string>} */
const labelsForIncompleteReasons = {
	inflammatoryComments: 'Inflammatory comments made',
	missingApplicationForm: 'Missing application form',
	missingDecisionNotice: 'Missing decision notice',
	missingGroundsForAppeal: 'Missing grounds of appeal',
	missingSupportingDocuments: 'Missing supporting documents',
	namesDoNotMatch: 'Names do not match',
	openedInError: 'Opened in error',
	sensitiveInfo: 'Sensitive information included',
	wrongAppealTypeUsed: 'Wrong appeal type used',
	otherReasons: 'Other'
};

/** @type {Record<keyof InvalidReasons, string>} */
const labelsForInvalidReasons = {
	notAppealable: 'Not appealable',
	lPADeemedInvalid: 'LPA deemed application as invalid',
	outOfTime: 'Out of time',
	noRightOfAppeal: 'No right of appeal',
	otherReasons: 'Other'
};

/** @type {Record<AppealOutcomeStatus, string>} */
const labelsForReviewOutcomeStatus = {
	valid: 'Appeal valid',
	invalid: 'Appeal invalid',
	incomplete: 'Something is missing or wrong'
};

/** @typedef {keyof IncompleteReasons | keyof InvalidReasons | AppealOutcomeStatus} LabelKey */

/** @type {Record<LabelKey, string>} */
const labels = {
	...labelsForIncompleteReasons,
	...labelsForInvalidReasons,
	...labelsForReviewOutcomeStatus
};

/**
 * Map a label key to a human readable string.
 *
 * @param {LabelKey} key - The reason key.
 * @param {boolean=} secondary – Whether the label should use a secondary
 * version (if it is exists). For example, 'Missing supporting documents'
 * becomes 'Supporting documents'.
 * @returns {string} - The label belonging to the key.
 */
export function validationLabel(key, secondary = false) {
	return secondary && key.startsWith('missing') ? capitalize(labels[key].split(' ').slice(1).join(' ')) : labels[key];
}

/**
 * @typedef {Object} CheckboxItem
 * @property {string} text - The label for the checkbox.
 * @property {string} value - The value of the checkbox.
 * @property {boolean} checked - The checked status of the checkbox.
 */

/**
 * Map a label key to a human readable string.
 *
 * @param {LabelKey} key - The reason key.
 * @param {Record<LabelKey, boolean>=} reasons - The reason key.
 * @returns {CheckboxItem} - The label belonging to the key.
 */
export function reasonCheckboxItem(key, reasons = /** @type {Record<LabelKey, boolean>} */ ({})) {
	return {
		value: key,
		text: validationLabel(key, true),
		checked: reasons[key]
	};
}
