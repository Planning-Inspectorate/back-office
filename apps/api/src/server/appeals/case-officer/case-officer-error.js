class CaseOfficerError extends Error {
	/**
	 * Creates a new instance of the CaseOfficerError class.
	 *
	 * @function Object() { [native code] }
	 * @param {string} message - The error message.
	 * @param {string} code - The error code.
	 */
	constructor(message, code) {
		super(message);
		this.code = code;
	}
}

export default CaseOfficerError;
