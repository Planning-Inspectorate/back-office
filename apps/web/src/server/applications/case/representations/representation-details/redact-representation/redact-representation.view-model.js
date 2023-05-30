import { url } from '../../../../../lib/nunjucks-filters/url.js';

/**
 * @param {string} caseId
 * @param {string} representationId
 * @returns { string }
 */
export const getPreviousPageUrl = (caseId, representationId) =>
	url('representation-details', {
		caseId: parseInt(caseId),
		representationId: parseInt(representationId)
	});

/**
 * @param {string} caseId
 * @param {string} representationId
 * @param {object} representation
 * @param {string} representation.originalRepresentation
 * @param {string?} representation.redactedRepresentation
 * @param {string?} representation.redactedNotes
 * @param {string?} representation.redactedBy
 * @param {string} projectName
 * @param {string} statusText
 * @returns {{ caseId: string, representationId: string, backLinkUrl: string, originalRepresentation: string, redactedRepresentation: string, notes: string?, redactedBy: string?, projectName: string, statusText: string }}
 */
export const getRedactRepresentationViewModel = (
	caseId,
	representationId,
	{ originalRepresentation, redactedRepresentation, redactedNotes, redactedBy },
	projectName,
	statusText
) => ({
	caseId,
	representationId,
	backLinkUrl: getPreviousPageUrl(caseId, representationId),
	originalRepresentation,
	redactedRepresentation: redactedRepresentation ? redactedRepresentation : originalRepresentation,
	notes: redactedNotes,
	redactedBy,
	projectName,
	statusText
});
