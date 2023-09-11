import { errorMessage } from './error-message.js';

/**
 * Map keyed errors to an array compatible with govuk error summary.
 *
 * @param {string | Object<string, {msg: string}>} errors - A dictionary of errors.
 * @returns {Array<{ text: string; href: string }>} – The error summary errors.
 */
export function mapToErrorSummary(errors) {
	if (typeof errors === 'string') {
		return [
			{
				text: errors,
				href: '#'
			}
		];
	}
	return Object.keys(errors).map((errorName) => ({
		text: errorMessage(errors[errorName])?.text || '',
		href: `#${errorName}`
	}));
}
