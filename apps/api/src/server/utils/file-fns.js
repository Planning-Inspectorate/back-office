// util script for various file functions

/**
 * Remove extension from document name, if it is a known extension
 *
 * @param {string} documentNameWithExtension
 * @returns {string}
 */
export const trimDocumentNameKnownSuffix = (documentNameWithExtension) => {
	if (!documentNameWithExtension.includes('.')) return documentNameWithExtension;

	const knownExtensions = [
		'avi',
		'bmp',
		'css',
		'csv',
		'db',
		'dbf',
		'doc',
		'docm',
		'docx',
		'dot',
		'dotm',
		'dotx',
		'eml',
		'exe',
		'gif',
		'htm',
		'html',
		'ico',
		'jfif',
		'jpeg',
		'jpg',
		'json',
		'lnk',
		'log',
		'mdb',
		'mov',
		'mp3',
		'mp4',
		'msg',
		'ods',
		'odt',
		'pdf',
		'png',
		'pps',
		'ppsx',
		'ppt',
		'pptm',
		'pptx',
		'prj',
		'pub',
		'rtf',
		'shp',
		'shx',
		'sig',
		'tif',
		'tiff',
		'tmp',
		'txt',
		'wav',
		'wbk',
		'wma',
		'wmv',
		'wmz',
		'wps',
		'xhtml',
		'xls',
		'xlsb',
		'xlsm',
		'xlsx',
		'xml',
		'xps',
		'zip'
	];
	const documentNameSplit = documentNameWithExtension.split('.');

	const thisFileExt = documentNameSplit.pop();
	if (thisFileExt && knownExtensions.includes(thisFileExt.toLowerCase())) {
		return documentNameSplit.join('.');
	}

	// if the file extension is not in the known extensions list, return the original name
	return documentNameWithExtension;
};

/**
 * Removes all multiple spaces from a string, and trims
 *
 * @param {string} str
 * @returns {string}
 */
export const removeMultipleSpacesAndTrim = (str) => {
	if (str === null || str === undefined) {
		return str;
	} else {
		return str.replace(/\s+/gm, ' ').trim();
	}
};
