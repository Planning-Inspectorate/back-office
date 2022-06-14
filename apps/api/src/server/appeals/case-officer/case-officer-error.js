class CaseOfficerError extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
	}
}

export default CaseOfficerError;
