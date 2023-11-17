class HttpError extends Error {
	constructor(/** @type {string} */ message, /** @type {number} */ statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

export default HttpError;
