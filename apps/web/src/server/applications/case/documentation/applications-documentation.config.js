export const redactionStatusDisplayValues = {
	redacted: 'Redacted',
	not_redacted: 'Unredacted',
	no_redaction_required: 'Redaction not needed',
	awaiting_ai_redaction: 'Redaction in progress',
	ai_redaction_failed: 'Redaction tool failed',
	awaiting_ai_suggestions: 'Suggestions in progress',
	ai_suggestions_review_required: 'Redactions suggested',
	ai_suggestions_reviewed: 'Suggestions reviewed'
};

/**
 * @param {string} folderName
 */
export const getUploadConfigForFolder = (folderName) => {
	const defaultAllowedTypes = [
		'dbf',
		'doc',
		'docx',
		'html',
		'jpeg',
		'jpg',
		'mov',
		'mp3',
		'mp4',
		'mpeg',
		'msg',
		'pdf',
		'png',
		'ppt',
		'pptx',
		'prj',
		'shp',
		'shx',
		'tif',
		'tiff',
		'xls',
		'xlsm',
		'xlsx'
	];

	if (folderName === 'gis-shapefiles') {
		return {
			isGisShapefilesFolder: true,
			allowedTypes: ['zip'],
			multiple: false,
			showUploadLabel: false,
			fileTypeText:
				'Your file must be a ZIP file containing exactly one geospatial SHP file, with any supporting files included',
			sizeText: 'The total size of your uploaded files must be smaller than 1GB',
			disclaimerText:
				'Saved shapefiles will be processed into a GeoJSON file with a document status of ‘not checked’'
		};
	}

	return {
		isGisShapefilesFolder: false,
		allowedTypes: defaultAllowedTypes,
		multiple: true,
		disclaimerText: 'Saving files will default them to ‘Unredacted’ and ‘Not checked’'
	};
};
