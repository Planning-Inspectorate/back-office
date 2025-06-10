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
 * @typedef {import('@azure/ai-text-analytics').PiiEntity & {accepted?: boolean}} RedactionSuggestion
 */

/**
 * @typedef {Object} RedactRepresentationViewModel
 * @property {string} caseId
 * @property {string} representationId
 * @property {string} backLinkUrl
 * @property {string} originalRepresentation
 * @property {string} redactedRepresentation
 * @property {string?} notes
 * @property {string?} redactedBy
 * @property {string} projectName
 * @property {string} statusText
 * @property {string?} organisationOrFullname
 * @property {string} [containerSize]
 * @property {RedactionSuggestion[]} [redactionSuggestions]
 */

/**
 * @param {string} caseId
 * @param {string} representationId
 * @param {object} representation
 * @param {string} representation.originalRepresentation
 * @param {string?} representation.redactedRepresentation
 * @param {string?} representation.redactedNotes
 * @param {string?} representation.redactedBy
 * @param {object} representation.represented
 * @param {string?} representation.represented.firstName
 * @param {string?} representation.represented.lastName
 * @param {string?} representation.represented.organisationName
 * @param {string} projectName
 * @param {string} statusText
 * @returns {RedactRepresentationViewModel}
 */
export const getRedactRepresentationViewModel = (
	caseId,
	representationId,
	{
		originalRepresentation,
		redactedRepresentation,
		redactedNotes,
		redactedBy,
		represented: { firstName, lastName, organisationName }
	},
	projectName,
	statusText
) => ({
	caseId,
	representationId,
	backLinkUrl: getPreviousPageUrl(caseId, representationId),
	originalRepresentation,
	redactedRepresentation: redactedRepresentation ? redactedRepresentation : originalRepresentation,
	organisationOrFullname: `${firstName || ''} ${lastName || ''}`.trim() || organisationName,
	notes: redactedNotes,
	redactedBy,
	projectName,
	statusText
});
