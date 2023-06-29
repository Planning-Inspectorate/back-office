/**
 * @param {object|*} locals
 * @returns {object}
 */

export const getRepresentationCommentViewModel = ({ representation }) => ({
	backLinkUrl: representation.pageLinks.backLinkUrl,
	pageTitle: 'Add representation'
});

/**
 *
 * @param {*} errors
 * @returns {object}
 */
export const getDateInputsErrorStatus = (errors) => {
	let errorMap = {
		day: false,
		month: false,
		year: false
	};

	Object.keys(errors).forEach((error) => {
		let errorMsg = errors[error].msg.toLowerCase();

		if (errorMsg.includes('day') && errorMsg.includes('month')) {
			errorMap.day = true;
			errorMap.month = true;
		}

		if (errorMsg.includes('day') && errorMsg.includes('year')) {
			errorMap.day = true;
			errorMap.year = true;
		}

		if (errorMsg.includes('month') && errorMsg.includes('year')) {
			errorMap.month = true;
			errorMap.year = true;
		}
	});

	return errorMap;
};
