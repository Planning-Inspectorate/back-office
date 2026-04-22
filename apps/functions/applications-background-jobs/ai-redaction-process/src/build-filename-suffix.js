/**
 * Builds filename suffix based on stage
 * @param {string} filename
 * @param {'suggest' | 'redact'} stage
 * @returns {string}
 */
export const buildFilenameSuffix = (filename, stage) => {
	if (!filename) {
		return stage === 'redact' ? 'Redacted.pdf' : 'Redaction_Suggestions.pdf';
	}

	const lastDot = filename.lastIndexOf('.');

	const name = lastDot === -1 ? filename : filename.slice(0, lastDot);
	const ext = lastDot === -1 ? '' : filename.slice(lastDot);

	// Remove existing suffixes to avoid duplication
	const cleanName = name.replace(/_Redaction_Suggestions$/, '').replace(/_Redacted$/, '');

	if (stage === 'suggest') {
		return `${cleanName}_Redaction_Suggestions${ext}`;
	}

	if (stage === 'redact') {
		return `${cleanName}_Redacted${ext}`;
	}

	return filename;
};
