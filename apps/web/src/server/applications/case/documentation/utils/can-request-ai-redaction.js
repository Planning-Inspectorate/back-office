/**
 * @param {import('../../../applications.types').DocumentationFile} document
 * @returns {boolean}
 */
export const canRequestAiRedaction = (document) => {
	if (document.mime !== 'application/pdf') {
		return false;
	}

	const eligibleStatuses = [null, 'not_redacted', 'ai_redaction_failed'];

	return eligibleStatuses.includes(document.redactedStatus);
};
