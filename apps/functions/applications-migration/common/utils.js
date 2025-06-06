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

export const valueToArray = (value) => (value ? JSON.parse(value) : []);

export const getServiceUserUnder18AndCountyValue = (value) => {
	switch (value) {
		case 'under18':
			return { under18: true, addressCounty: null };
		case 'over18':
			return { under18: false, addressCounty: null };
		default:
			return { under18: null, addressCounty: value };
	}
};

/**
 *
 * @param {string | boolean} value
 * @returns
 */
export const toBoolean = (value) => {
	let isBool = false;
	if (typeof value === 'boolean') {
		isBool = value;
	} else if (typeof value === 'string' && value.length > 0) {
		isBool = value.toLowerCase() === 'true';
	}
	return isBool;
};
