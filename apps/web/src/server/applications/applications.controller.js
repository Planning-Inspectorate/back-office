import * as applicationsService from './applications.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./applications.locals').ApplicationLocals} ApplicationLocals */
/** @typedef {import('./applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications.types').Application} Application */
/** @typedef {import('./applications.types').ApplicationSummary} ApplicationSummary */
/** @typedef {import('./applications.types').DomainType} DomainType */

/**
 * @typedef {object} ViewDashboardRenderProps
 * @property {ApplicationSummary[]} applications
 */

/**
 * View the domain-specific dashboard for the open applications.
 *
 * @type {import('@pins/express').RenderHandler<ViewDashboardRenderProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewDashboard({ params }, res) {
	switch (params.domainType) {
		case 'case-admin-officer': {
			const result = await applicationsService.findOpenApplicationsForCaseAdminOfficer();

			return res.render('applications/dashboard', {
				applications: result.items
			});
		}
		case 'case-officer': {
			const result = await applicationsService.findOpenApplicationsForCaseOfficer();

			return res.render('applications/dashboard', {
				applications: result.items
			});
		}
		case 'inspector': {
			const result = await applicationsService.findOpenApplicationsForInspector();

			return res.render('applications/dashboard', {
				applications: result.items
			});
		}
		default:
			res.render('app/404');
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
