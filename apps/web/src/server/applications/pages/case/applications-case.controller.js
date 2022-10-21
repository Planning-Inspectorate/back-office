/** @typedef {import('../../applications.locals').ApplicationLocals} ApplicationLocals */
/** @typedef {import('../../applications.types').Case} Case */

/**
 * View the details for a single case
 *
 * @type {import('@pins/express').RenderHandler<{selectedPageType: string}, {}>}
 */
export async function viewApplicationsCasePages(request, response) {
	// note: casedetails for this case are held in response.locals.case
	const pageType = request.params.pageType ?? 'overview';
	const properties = { selectedPageType: pageType };

	response.render(`applications/case/${pageType}`, properties);
}
