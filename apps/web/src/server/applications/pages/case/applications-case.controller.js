/** @typedef {import('../../applications.locals').ApplicationLocals} ApplicationLocals */
/** @typedef {import('../../applications.types').Case} Case */

/**
 * View the details for a single case application
 *
 * @type {import('@pins/express').RenderHandler<{selectedPageType: string}, {}>}
 */
export async function viewApplicationsCasePages(request, response) {
	// note: application details for this case are held in response.locals.application
	const pageType = request.params.pageType ?? 'overview';
	const properties = { selectedPageType: pageType };

	response.render(`applications/case/${pageType}`, properties);
}
