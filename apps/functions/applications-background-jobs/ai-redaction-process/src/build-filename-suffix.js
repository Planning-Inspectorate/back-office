/**
 * Adds `_Redaction_Suggestions` before the file extension
 * @param {string} filename
 * @returns {string}
 */
export const buildFilenameSuffix = (filename) => {
	if (!filename) return 'Redaction_Suggestions.pdf';

	const lastDot = filename.lastIndexOf('.');

	if (lastDot === -1) {
		return `${filename}_Redaction_Suggestions`;
	}

	const name = filename.slice(0, lastDot);
	const ext = filename.slice(lastDot);

	if (name.endsWith('_Redaction_Suggestions')) {
		return filename;
	}

	return `${name}_Redaction_Suggestions${ext}`;
};
