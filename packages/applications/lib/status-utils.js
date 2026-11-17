/**
 * Application status types used across the applications system
 * @typedef {'draft' | 'ready-to-publish' | 'published' | 'ready-to-unpublish' | 'unpublished' | 'archived'} ApplicationStatus
 */

/**
 * Status tag classes mapping for UI display
 * @typedef {Object.<ApplicationStatus, string>} StatusTagClasses
 */

/**
 * Mapping of application statuses to their corresponding tag classes
 * @type {StatusTagClasses}
 */
export const STATUS_TAG_CLASSES = {
	draft: 'govuk-tag--grey',
	'ready-to-publish': 'govuk-tag--blue',
	published: 'govuk-tag--green',
	'ready-to-unpublish': 'govuk-tag--yellow',
	unpublished: 'govuk-tag--grey',
	archived: 'govuk-tag--purple'
};

/**
 * Get the tag class for a given status
 * @param {ApplicationStatus} status - The application status
 * @returns {string} The corresponding tag class
 */
export const getStatusTagClass = (status) => {
	return STATUS_TAG_CLASSES[status] || 'govuk-tag--grey';
};

/**
 * Get the display name for a given status
 * @param {ApplicationStatus} status - The application status
 * @returns {string} The display name for the status
 */
export const getStatusDisplayName = (status) => {
	const displayNames = {
		draft: 'Draft',
		'ready-to-publish': 'Ready to publish',
		published: 'Published',
		'ready-to-unpublish': 'Ready to unpublish',
		unpublished: 'Unpublished',
		archived: 'Archived'
	};
	return displayNames[status] || status;
};

/**
 * Get all application status values
 * @returns {ApplicationStatus[]} All application status values
 */
export const getAllApplicationStatuses = () => {
	// @ts-ignore
	return Object.keys(STATUS_TAG_CLASSES);
};
