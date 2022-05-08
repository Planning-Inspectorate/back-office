import * as crypto from 'node:crypto';

export class CryptoUtils {
	/**
	 * @param {string} algorithm
	 */
	constructor(algorithm = 'aes-192-cbc') {
		/**
		 * @type {string}
		 * @private
		 */
		this.algorithm = algorithm;
	}

	/**
	 * @returns {string}
	 */
	generateSalt() {
		return crypto.randomBytes(20).toString('hex');
	}

	/**
	 * @param {import('crypto').BinaryLike} password
	 * @param {import('crypto').BinaryLike} salt
	 * @returns {Buffer}
	 */
	createKey(password, salt) {
		return crypto.scryptSync(password, salt, 24);
	}

	/**
	 * @param {string} stringifiedData
	 * @param {import('crypto').CipherKey} key
	 * @returns {string}
	 */
	encryptData(stringifiedData, key) {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(this.algorithm, key, iv);
		const encryptedData = cipher.update(stringifiedData, 'utf8', 'hex');

		return [iv.toString('hex'), encryptedData + cipher.final('hex')].join('.');
	}

	/**
	 * @param {string} encryptedData
	 * @param {import('crypto').CipherKey} key
	 * @returns {string}
	 */
	decryptData(encryptedData, key) {
		const [iv, encrypted] = encryptedData.split('.');
		const decipher = crypto.createDecipheriv(this.algorithm, key, Buffer.from(iv, 'hex'));

		return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
	}
}
