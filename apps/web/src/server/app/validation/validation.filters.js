import { validationLabelsMap } from './validation.config.js';

/** @typedef {import('@pins/validation').Appeal['reasons']} Reasons */

/**
 * Map a reason for an incomplete appeal to a human readable string.
 *
 * @param {keyof Reasons} key - The reason key.
 * @returns {string} - The label belonging to the reason.
 */
export function incompleteReasonLabel(key) {
	// Note that the entries in validation.config.js use a nested structure and
	// are not fully compatible with the keys used by the Appeal model
	
	/** @type {Record<keyof Reasons, string>} */
	const incompleteReasonLabels = {
		...validationLabelsMap.incompleteAppealReasons,
		missingApplicationForm: 'Missing application form',
		missingDecisionNotice: 'Missing decision notice',
		missingGroundsForAppeal: 'Missing grounds for appeal',
		missingSupportingDocuments: 'Missing supporting documents'
	};

	return incompleteReasonLabels[key];
}

/**
 * Map the appeal site address data to its formatted html representation.
 * 
 * @param {import('@pins/validation').Appeal['AppealSite']} addressSite - The appeal site data.
 * @param {string} delimiter – The character(s) which which to join lines of the address. Defaults to <br>.
 * @returns {string} - An html representation of the appeal site.
 */
export function address(addressSite, delimiter = '<br>') {
	return Object.values(addressSite).filter(Boolean).join(delimiter);
}
