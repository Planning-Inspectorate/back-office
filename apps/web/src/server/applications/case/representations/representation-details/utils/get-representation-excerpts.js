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
	originalRepresentationWithoutBackticks,
	redactedRepresentationWithoutBackticks,
	redactedNotesWithoutBackticks
}) => ({
	originalRepresentationWithoutBackticksExcerpt: getExcerpt(originalRepresentationWithoutBackticks),
	redactedRepresentationWithoutBackticksExcerpt: getExcerpt(redactedRepresentationWithoutBackticks),
	redactedNotesWithoutBackticksExcerpt: getExcerpt(redactedNotesWithoutBackticks)
});
