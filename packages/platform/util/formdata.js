import fs from 'fs';

/**
 * @typedef {object} AppendFilesToFormDataConfig
 * @property {string} key
 * @property {Express.Multer.File} [file]
 * @property {Express.Multer.File[]} [files]
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
	const files = /** @type {Express.Multer.File[]} */ (config.files || [config.file]);

	for (const file of files) {
		if (file.buffer) {
			formData.append(config.key, file.buffer, { filename: file.originalname });
		} else {
			formData.append(config.key, fs.createReadStream(file.path));
		}
	}
};
