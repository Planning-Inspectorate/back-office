import { capitalize } from 'lodash-es';

/** @typedef {import('@pins/appeals').Validation.AppealOutcomeStatus} AppealOutcomeStatus */
/** @typedef {import('@pins/appeals').Validation.IncompleteReasonType} IncompleteReasonType */
/** @typedef {import('@pins/appeals').Validation.InvalidReasonType} InvalidReasonType */

/** @type {Record<IncompleteReasonType, string>} */
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

/** @type {Record<InvalidReasonType, string>} */
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

/** @typedef {IncompleteReasonType | InvalidReasonType | AppealOutcomeStatus} LabelKey */

/** @type {Record<LabelKey, string>} */
const labels = {
	...labelsForIncompleteReasons,
	...labelsForInvalidReasons,
	...labelsForReviewOutcomeStatus
};

/**
 * Map a label key to a human readable string.
 *
 * @param {LabelKey} key
 * @param {boolean=} secondary – Whether the label should use a secondary
 * version (if it is exists). For example, 'Missing supporting documents'
 * becomes 'Supporting documents'.
 * @returns {string}
 */
export function validationLabel(key, secondary = false) {
	return secondary && key.startsWith('missing')
		? capitalize(labels[key].split(' ').slice(1).join(' '))
		: labels[key];
}

/**
 * @typedef {object} CheckboxItem
 * @property {string} text
 * @property {string} value
 * @property {boolean} checked
 */

/**
 * Map a label key to a `govukCheckboxes` item.
 *
 * @param {LabelKey} key
 * @param {Record<LabelKey, boolean>=} reasons
 * @returns {CheckboxItem}
 */
export function reasonCheckboxItem(key, reasons = /** @type {Record<LabelKey, boolean>} */ ({})) {
	return {
		value: key,
		text: validationLabel(key, true),
		checked: reasons[key]
	};
}
