import crypto from 'crypto';
import fs from 'fs';

const hashLength = 8;

/**
 * Generate and validate hash
 *
 * @param {*} c Input source
 * @returns {string} hash value
 */
function generateAndValidateHash(c) {
	// eslint-disable-next-line unicorn/prefer-string-slice
	const hash = c.digest('hex').substr(0, hashLength);
	if (hash.length !== hashLength) {
		throw new TypeError('could not hash content');
	}
	return hash;
}

/**
 * Hashes the passed content.
 *
 * @param {string} contents to hash
 * @returns {string} hash value
 */
function hashForContent(contents) {
	const c = crypto.createHash('sha1');
	c.update(contents);
	return generateAndValidateHash(c);
}

/**
 * Hashes the passed files. Requires at least one.
 *
 * @param {string} file base file to hash
 * @param {...string} rest additional files to hash
 * @returns {string} hash value
 */
function hashForFiles(file, ...rest) {
	const files = [file].concat(rest);

	const c = crypto.createHash('sha1');

	for (const fileInstance of files) {
		const b = fs.readFileSync(fileInstance);
		c.update(b);
	}

	return generateAndValidateHash(c);
}

export {
	generateAndValidateHash,
	hashForContent,
	hashForFiles
};
