/**
 * Central map for all relevant representation statuses
 * @typedef {Object} RepresentationStatus
 * @property {string} text - Display text for the status
 * @property {string} value - Status value (enum)
 */

export const RELEVANT_REPRESENTATION_STATUS_MAP = {
	AWAITING_REVIEW: 'AWAITING_REVIEW',
	VALID: 'VALID',
	DRAFT: 'DRAFT',
	PUBLISHED: 'PUBLISHED',
	REFERRED: 'REFERRED',
	WITHDRAWN: 'WITHDRAWN',
	INVALID: 'INVALID',
	ARCHIVED: 'ARCHIVED',
	UNDER_18: 'UNDER_18',
	UNPUBLISHED: 'UNPUBLISHED'
};

/**
 * Get an array of all status objects (for mapping/filtering).
 */
export const RELEVANT_REPRESENTATION_STATUS_LIST = Object.values(
	RELEVANT_REPRESENTATION_STATUS_MAP
);
