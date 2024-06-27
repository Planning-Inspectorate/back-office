import { Readable } from 'stream';

/**
 * @param {any} obj
 *
 * @returns {any} obj
 */
export const removeNullValues = (obj) => removeValues(obj, [null]);

/**
 * @param {object} obj
 * @param {any[]} values
 */
export const removeValues = (obj, values) => {
	Object.keys(obj).forEach((key) => {
		if (values.includes(obj[key])) {
			delete obj[key];
		}
	});

	return obj;
};

/**
 * @param {NodeJS.ReadableStream} readableStream
 * @returns {Promise<string>}
 */
export const streamToString = async (readableStream) => {
	return new Promise((resolve, reject) => {
		/** @type {string[]} */
		const chunks = [];
		readableStream.on('data', (chunk) => {
			chunks.push(chunk.toString());
		});
		readableStream.on('end', () => {
			resolve(chunks.join(''));
		});
		readableStream.on('error', reject);
	});
};

/**
 *
 * @param {string} string
 */
export const stringToStream = (string) => {
	const readable = new Readable({
		read() {
			readable.push(string);
			readable.push(null);
		}
	});
	return readable;
};
