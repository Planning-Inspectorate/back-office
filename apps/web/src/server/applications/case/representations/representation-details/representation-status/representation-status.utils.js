import { url } from '../../../../../lib/nunjucks-filters/url.js';
/**
 *
 * @param {{status: string, updatedBy: string|undefined, body: {notes: string?, statusResult: string?}}} statusUpdate
 * @returns {object}
 */
export const mapStatusPayload = (statusUpdate) => {
	let mappedPayload = {};

	mappedPayload.status = statusUpdate.status;
	mappedPayload.updatedBy = statusUpdate.updatedBy;

	if (statusUpdate.body.notes) mappedPayload.notes = statusUpdate.body.notes;
	if (statusUpdate.status === 'REFERRED') mappedPayload.referredTo = statusUpdate.body.statusResult;
	if (statusUpdate.status === 'INVALID')
		mappedPayload.invalidReason = statusUpdate.body.statusResult;

	return mappedPayload;
};

/**
 * @param {string} caseId
 * @param {string} representationId
 * @returns { string }
 */
export const getRepresentationDetailsPageUrl = (caseId, representationId) =>
	url('representation-details', {
		caseId: parseInt(caseId),
		representationId: parseInt(representationId)
	});

/**
 * @param {string} caseId
 * @param {string} representationId
 * @returns { string }
 */
export const getChangeStatusPageUrl = (caseId, representationId) =>
	url('change-status', {
		caseId: parseInt(caseId),
		representationId: parseInt(representationId)
	});
/**
 * @param {string} caseId
 * @param {string} representationId
 * @returns { string }
 */
export const getStatusResultPageUrl = (caseId, representationId) =>
	url('status-result', {
		caseId: parseInt(caseId),
		representationId: parseInt(representationId)
	});
