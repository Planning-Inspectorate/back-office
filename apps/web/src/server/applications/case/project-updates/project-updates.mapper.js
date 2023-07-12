/**
 * Map a request body to a create project update request
 * @param {any} body
 * @returns {any} // todo: specific type
 */
export function bodyToCreateRequest(body) {
	return {
		status: 'draft',
		htmlContent: body.content.replaceAll('<p><br></p>', '<br>').replaceAll('<br>', '<br />'),
		emailSubscribers: body.emailSubscribers === 'true'
	};
}
