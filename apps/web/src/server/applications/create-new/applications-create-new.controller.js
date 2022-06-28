/**
 * View the first step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function createNewCase(req, response) {
	response.render('applications/create-new');
}
