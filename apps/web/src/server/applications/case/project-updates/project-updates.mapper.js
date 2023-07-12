/**
 * Map a request body to a create project update request
 *
 * @param {any} body
 * @returns {any} // todo: specific type
 */
export function bodyToCreateRequest(body) {
	const content = decodeURI(body.content)
		.replaceAll('<p><br></p>', '<br>')
		.replaceAll('<br>', '<br />');

	return {
		status: 'draft',
		htmlContent: content,
		emailSubscribers: body.emailSubscribers === 'true'
	};
}
