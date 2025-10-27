const maxRepTextLength = 200;

/**
 *
 * @param {string} text
 * @returns {string}
 */
const getExcerpt = (text) =>
	text && text.length >= maxRepTextLength
		? `${text.slice(0, Math.max(0, text.lastIndexOf(' ', maxRepTextLength)))}`
		: '';

/**
 * @param {object|*} representation
 * @return {object}
 */
export const getRepresentationExcerpts = ({
	originalRepresentation,
	redactedRepresentation,
	redactedNotes
}) => ({
	originalRepresentationExcerpt: getExcerpt(originalRepresentation),
	redactedRepresentationExcerpt: getExcerpt(redactedRepresentation),
	redactedNotesExcerpt: getExcerpt(redactedNotes)
});
