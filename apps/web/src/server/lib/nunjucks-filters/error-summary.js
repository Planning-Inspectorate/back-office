/**
 * Map keyed errors to an array compatible with govuk error summary.
 * 
 * @param {Object.<string, { msg: string }r>} errors - A dictionary of errors.
 * @returns {Array<{ text: string; href: string }>} – The error summary errors.
 */
export function mapToErrorSummary(errors) {
	return Object.keys(errors).map((errorName) => ({ 
		text: errors[errorName].msg,
		href: `#${errorName}`
	}));
}
