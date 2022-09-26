/** @typedef {import('../applications.locals').ApplicationLocals} ApplicationLocals */
/** @typedef {import('../applications.types').Application} Application */

/**
 * @typedef {object} ViewApplicationRenderProps
 * @property {Application} application
 */

/**
 * View the details for a single application - overview page
 *
 * @type {import('@pins/express').RenderHandler<ViewApplicationRenderProps, ApplicationLocals>}
 */
export async function viewApplicationSummary(request, response) {
	// console.log('_____ locals.application:', response.locals.application);
	response.render('applications/summary/application-summary-overview');
}

/**
 * View the details for a single application - project information page
 *
 * @type {import('@pins/express').RenderHandler<ViewApplicationRenderProps, ApplicationLocals>}
 */
export async function viewApplicationProjectInformation(request, response) {
	response.render('applications/summary/application-summary-project-information');
}
