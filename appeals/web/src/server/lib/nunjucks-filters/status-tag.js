import { capitalizeFirstLetter } from '#lib/string-utilities.js';

/**
 * Maps appealStatus values to status-tag text labels
 *
 * @param {string} appealStatus
 * @returns {string}
 */
export function appealStatusToStatusTag(appealStatus) {
	return capitalizeFirstLetter(
		appealStatus
			.replace('issue_determination', 'issue_decision')
			.replace('lpa_', 'LPA_')
			.replace('lpaq_', 'LPAQ_')
			.replaceAll('_', ' ')
	);
}
