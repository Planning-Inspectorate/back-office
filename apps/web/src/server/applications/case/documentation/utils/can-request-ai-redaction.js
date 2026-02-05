/**
 * @param {import('../../../applications.types').DocumentationFile} document
 * @returns {boolean}
 */
export const canRequestAiRedaction = (document) => {
	if (document.mime !== 'application/pdf') {
		return false;
	}

	// api maps null to an empty string
	const eligibleStatuses = ['', 'not_redacted', 'ai_redaction_failed'];

	return eligibleStatuses.includes(document.redactedStatus);
};
