/**
 * Map a request body to a create project update request
 *
 * @param {any} body
 * @returns {any} // todo: specific type
 */
export function bodyToCreateRequest(body) {
	return {
		status: 'draft',
		...bodyToUpdateRequest(body)
	};
}

/**
 * Map html content to request content
 *
 * @param {string} content
 * @returns {string}
 */
function mapContent(content) {
	return decodeURI(content)
		.replaceAll('<em>', '')
		.replaceAll('</em>', '')
		.replaceAll('<br>', '<br />')
		.replaceAll('<p><br /></p>', '<br />')
		.replaceAll('&nbsp;', ' '); // these are sometimes included when copy+pasting in an update
}

/**
 * Map a request body to an update project update request
 *
 * @param {any} body
 * @returns {any} // todo: specific type
 */
export function bodyToUpdateRequest(body) {
	const htmlContent = mapContent(body.backOfficeProjectUpdateContent);
	const htmlContentWelsh = mapContent(body.backOfficeProjectUpdateContentWelsh);

	return {
		htmlContent,
		htmlContentWelsh,
		emailSubscribers: body.emailSubscribers === 'true'
	};
}
