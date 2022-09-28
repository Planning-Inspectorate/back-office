/** @typedef {import('../applications.locals').ApplicationLocals} ApplicationLocals */
/** @typedef {import('../applications.types').Application} Application */

/**
 * @typedef {object} ViewApplicationRenderProps
 * @property {Application} application
 */

/**
 * View the details for a single case application - page required in the param pageType
 *
 * @type {import('@pins/express').RenderHandler<ViewApplicationRenderProps, ApplicationLocals>}
 */
export async function viewApplicationSummaryPages(request, response) {
	// note: application details for this case are held in response.locals.application
	const pageType = request.params.pageType ?? 'overview';

	response.render(`applications/summary/${pageType}`);
}
