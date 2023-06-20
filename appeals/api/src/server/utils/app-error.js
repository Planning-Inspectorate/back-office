class BackOfficeAppError extends Error {
	code;
	status;
	isOperational;

	constructor(/** @type {string} */ message, /** @type {number} */ statusCode) {
		super(message);

		this.code = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

export default BackOfficeAppError;
