import fs from 'node:fs';

/** @typedef {import('../types/multer').MulterFile} MulterFile */

/**
 * @typedef {object} AppendFilesToFormDataConfig
 * @property {string} key
 * @property {MulterFile} [file]
 * @property {MulterFile[]} [files]
 */

/**
 * Append files to a `FormData` instance, regardless of whether they exist in
 * memory (as a buffer) or on disk.
 *
 * @param {import('form-data')} formData
 * @param {AppendFilesToFormDataConfig} config
 * @returns {void}
 */
export const appendFilesToFormData = (formData, config) => {
	const files = /** @type {MulterFile[]} */ (config.files || [config.file]);

	for (const file of files) {
		if (file.buffer) {
			formData.append(config.key, file.buffer, { filename: file.originalname });
		} else if (file.path) {
			formData.append(config.key, fs.createReadStream(file.path));
		} else {
			throw new Error(`Unable to add ${file.originalname} to FormData. No content found.`);
		}
	}
};
