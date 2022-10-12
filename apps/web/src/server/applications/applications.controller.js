import { sortBy } from 'lodash-es';
import * as applicationsService from './applications.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./applications.locals').ApplicationLocals} ApplicationLocals */
/** @typedef {import('./applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications.types').Case} Case */
/** @typedef {import('./applications.types').DomainType} DomainType */

/**
 * @typedef {object} ViewDashboardRenderProps
 * @property {Case[]} applications
 * @property {Case[]} draftApplications
 */

/**
 * View the domain-specific dashboard for the open applications.
 *
 * @type {import('@pins/express').RenderHandler<ViewDashboardRenderProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewDashboard({ params }, res) {
	const { domainType } = params;
	const allApplications = await applicationsService.findOpenApplicationsByDomainType(domainType);
	const readyApplications = [];

	let draftApplications = [];

	for (const application of allApplications) {
		if (application.status === 'Draft') {
			draftApplications.push(application);
		} else {
			readyApplications.push(application);
		}
	}

	draftApplications = sortBy(draftApplications, ['modifiedDate']);

	return res.render('applications/dashboard', {
		applications: readyApplications,
		draftApplications
	});
}
