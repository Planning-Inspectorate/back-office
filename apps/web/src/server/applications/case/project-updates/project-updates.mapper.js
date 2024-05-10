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
 * Map a request body to an update project update request
 *
 * @param {any} body
 * @returns {any} // todo: specific type
 */
export function bodyToUpdateRequest(body) {
	const content = decodeURI(body.backOfficeProjectUpdateContent)
		.replaceAll('<em>', '')
		.replaceAll('</em>', '')
		.replaceAll('<br>', '<br />')
		.replaceAll('<p><br /></p>', '<br />')
		.replaceAll('&nbsp;', ' '); // these are sometimes included when copy+pasting in an update

	return {
		htmlContent: content,
		emailSubscribers: body.emailSubscribers === 'true'
	};
}
