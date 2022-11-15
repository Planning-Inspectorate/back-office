/**
 * Returns MIME type from extension
 *
 * @param {string} extension
 * @returns {string}
 */
export const MIME = (extension) => {
	/** @type {Record<string, string>} */
	const MIMEs = {
		pdf: 'application/pdf',
		doc: 'application/msword',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		ppt: 'application/vnd.ms-powerpoint',
		pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		xls: 'application/vnd.ms-excel',
		xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		mpeg: 'video/mpeg',
		mp3: 'audio/mpeg',
		mp4: 'video/mp4',
		mov: 'video/quicktime',
		png: 'image/png',
		tiff: 'image/tiff',
		tif: 'image/tiff'
	};

	return `.${extension}${MIMEs[extension] ? `,${MIMEs[extension]}` : ''},`;
};
