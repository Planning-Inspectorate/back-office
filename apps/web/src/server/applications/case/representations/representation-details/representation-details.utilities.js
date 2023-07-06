/**
 *
 * @param {*} errors
 * @returns {object}
 */
export const getFormattedErrorSummary = (errors) =>
	Object.keys(errors).map((error) => ({
		text: errors[error].msg,
		href: `#${error}`
	}));
