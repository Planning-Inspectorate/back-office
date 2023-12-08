/**
 * Maps appealStatus values to status-tag text labels
 *
 * @param {string} appealStatus
 * @returns {string}
 */
export function appealStatusToStatusTag(appealStatus) {
	return appealStatus.replace('issue_determination', 'issue_decision').replaceAll('_', ' ');
}
