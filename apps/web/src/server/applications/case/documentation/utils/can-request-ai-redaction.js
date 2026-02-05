/**
 * @param {import('../../../applications.types').DocumentationFile} document
 * @returns {boolean}
 */
export const canRequestAiRedaction = (document) => {
	if (document.mime !== 'application/pdf') {
		return false;
	}

	const ineligibleStatuses = ['awaiting_ai_redaction', 'ai_redaction_review_required'];

	return !ineligibleStatuses.includes(document.redactedStatus);
};
