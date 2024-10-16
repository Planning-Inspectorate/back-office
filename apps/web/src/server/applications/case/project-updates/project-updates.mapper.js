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
		.replaceAll('&amp;amp;', '&amp;')
		.replaceAll('&nbsp;', ' '); // these are sometimes included when copy+pasting in an update
}

/**
 * Map a request body to an update project update request
 *
 * @param {any} body
 * @returns {{emailSubscribers: boolean, htmlContent: string, htmlContentWelsh?: string}}
 */
export function bodyToUpdateRequest(body) {
	const request = {
		htmlContent: mapContent(body.backOfficeProjectUpdateContent),
		emailSubscribers: body.emailSubscribers === 'true'
	};

	if (body.backOfficeProjectUpdateContentWelsh) {
		return { ...request, htmlContentWelsh: mapContent(body.backOfficeProjectUpdateContentWelsh) };
	}

	return request;
}
