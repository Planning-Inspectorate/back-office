/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./applications.locals').ApplicationLocals} ApplicationLocals */
/** @typedef {import('./applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications.types').Application} Application */
/** @typedef {import('./applications.types').ApplicationSummary} ApplicationSummary */
/** @typedef {import('./applications.types').DomainType} DomainType */

/**
 * @typedef {object} ViewDashboardErrors
 * @property {string} text
 */

/**
 * @typedef {object} ViewDashboardRenderProps
 * @property {ApplicationSummary[]|null} applications
 * @property {ViewDashboardErrors=} searchApplicationsError
 */

/**
 * View the domain-specific dashboard for the open applications.
 *
 * @type {import('@pins/express').RenderHandler<ViewDashboardRenderProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewDashboard(req, res) {
	if (res.locals.applications !== null) {
		return res.render('applications/dashboard', { applications: res.locals.applications });
	}
	res.render('app/404');
}

/**
 * Search applications.
 *
 * @type {import('@pins/express').RenderHandler<ViewDashboardRenderProps,
  {}, {}, {}, DomainParams>} */
export async function searchApplications(req, response) {
	if (req.errors) {
		const { locals } = response;
		const { SearchApplications } = req.errors;
		const searchApplicationsError = SearchApplications?.msg
			? { text: SearchApplications?.msg }
			: SearchApplications?.msg;

		return response.render('applications/dashboard', {
			applications: locals.applications,
			searchApplicationsError
		});
	}
}

/**
 * @typedef {object} ViewApplicationRenderProps
 * @property {Application} application
 */

/**
 * View the details for a single application.
 *
 * @type {import('@pins/express').RenderHandler<ViewApplicationRenderProps, ApplicationLocals>}
 */
export async function viewApplication({ locals }, response) {
	response.render('applications/application', { application: locals.application });
}
