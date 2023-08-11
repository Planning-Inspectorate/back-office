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
		.replaceAll('<p><br></p>', '<br>')
		.replaceAll('<br>', '<br />');

	return {
		htmlContent: content,
		emailSubscribers: body.emailSubscribers === 'true'
	};
}
