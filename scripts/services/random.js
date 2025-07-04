const crypto = require('crypto');

/**
 * Random Service
 * Generates secure random strings using Node.js crypto
 */
class RandomService {
	/**
	 * Generate a secure random session secret
	 * @param {number} bytes - Number of random bytes (default: 32)
	 * @returns {string} Hex string (64 characters for 32 bytes)
	 */
	static generateSessionSecret(bytes = 32) {
		return crypto.randomBytes(bytes).toString('hex');
	}

	/**
	 * Generate a random string using available packages
	 * @param {number} length - Length of the string
	 * @returns {string} Random string
	 */
	static generateRandomString(length = 32) {
		// Option 1: Using crypto (most secure)
		const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
		return randomBytes.toString('hex').slice(0, length);
	}

	/**
	 * Generate a UUID-like string using crypto
	 * @returns {string} UUID-like string
	 */
	static generateUUID() {
		// Generate a simple UUID v4-like string using crypto
		const randomBytes = crypto.randomBytes(16);

		// Set version (4) and variant bits
		randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
		randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

		const hex = randomBytes.toString('hex');
		return [
			hex.substring(0, 8),
			hex.substring(8, 12),
			hex.substring(12, 16),
			hex.substring(16, 20),
			hex.substring(20, 32)
		].join('-');
	}

	/**
	 * Alternative: Using @faker-js/faker if crypto is not preferred
	 * @param {number} length - Length of string
	 * @returns {string} Random string
	 */
	static generateFakerString(length = 32) {
		try {
			const { faker } = require('@faker-js/faker');
			return faker.string.alphanumeric(length);
		} catch (error) {
			// Fallback to crypto if faker is not available
			return this.generateRandomString(length);
		}
	}
}

module.exports = RandomService;
