import * as applicationsService from './applications.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./applications.locals').ApplicationLocals} ApplicationLocals */
/** @typedef {import('./applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications.types').Application} Application */
/** @typedef {import('./applications.types').DomainType} DomainType */

/**
 * @typedef {object} ViewDashboardRenderProps
 * @property {Application[]} applications
 */

/**
 * View the domain-specific dashboard for the open applications.
 *
 * @type {import('@pins/express').RenderHandler<ViewDashboardRenderProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewDashboard({ params }, res) {
	const { domainType } = params;
	const applications = await applicationsService.findOpenApplicationsByDomainType(domainType);

	return res.render('applications/dashboard', { applications });
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
