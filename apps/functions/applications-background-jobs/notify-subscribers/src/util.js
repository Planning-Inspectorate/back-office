import crypto from 'crypto';
import { loadConfig } from './config.js';

/**
 * Returns a promise that waits for the given time before resolving.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get a project link - for the front office
 *
 * @param {string} caseReference
 * @returns {string}
 */
export function projectLink(caseReference) {
	const config = loadConfig();
	return `${config.FRONT_OFFICE_URL}/projects/${caseReference}`;
}

/**
 * Generate an unsubscribe link for the case reference + email address - this links to the front office
 *
 * @param {string} caseReference
 * @param {string} emailAddress
 * @returns {string}
 */
export function unsubscribeLink(caseReference, emailAddress) {
	const config = loadConfig();
	const email = encrypt(emailAddress);
	return `${config.FRONT_OFFICE_URL}/projects/${caseReference}/get-updates/unsubscribe-confirm?email=${email};`;
}

/**
 * Encrypt a value, used for unsubscribe links
 *
 * @see https://github.com/Planning-Inspectorate/applications-service/blob/main/packages/applications-service-api/src/lib/crypto.js
 *
 * @param {string} value
 * @returns {string}
 */
export function encrypt(value) {
	const config = loadConfig();
	const iv = crypto.randomBytes(config.ENCRYPT_IV_LENGTH);
	const cipher = crypto.createCipheriv(config.ENCRYPT_ALGORITHM, config.ENCRYPT_KEY, iv);
	const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);

	return `${iv.toString('hex')}${encrypted.toString('hex')}`;
}
