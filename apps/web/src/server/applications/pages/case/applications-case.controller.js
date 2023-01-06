/** @typedef {import('../../applications.types').Case} Case */

/**
 * View the details for a single case
 *
 * @type {import('@pins/express').RenderHandler<{selectedPageType: string}, {}, {}, {}, {pageType?: string}>}
 */
export async function viewApplicationsCasePages({ params }, response) {
	// note: case details for this case are held in response.locals.case
	const { pageType } = params;
	const selectedPageType = pageType ?? 'overview';

	response.render(`applications/case/${selectedPageType}`, { selectedPageType });
}

/**
 * View the preview and publish page for a single case
 *
 * @type {import('@pins/express').RenderHandler<{selectedPageType: string}, {}, {}, {}, {pageType?: string}>}
 */
export async function viewApplicationsCasePublishPage(request, response) {
	response.render(`applications/case/preview-publish`);
}
