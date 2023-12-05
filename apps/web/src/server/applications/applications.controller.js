import { sortBy } from 'lodash-es';
import * as applicationsService from './applications.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('./applications.types').Case} Case */

/**
 * @typedef {object} ViewDashboardRenderProps
 * @property {Case[]} cases
 * @property {Case[]} draftCases
 */

/**
 * View the domain-specific dashboard for the open applications.
 *
 * @type {import('@pins/express').RenderHandler<ViewDashboardRenderProps, {}, {}, {}, {}>}
 */
export async function viewDashboard(_, res) {
	const allCases = (await applicationsService.findOpenCasesByDomainType('case-team')) || [];
	const readyCases = [];

	let draftCases = [];

	for (const singleCase of allCases) {
		if (singleCase.status === 'Draft') {
			draftCases.push(singleCase);
		} else {
			readyCases.push(singleCase);
		}
	}

	draftCases = sortBy(draftCases, ['modifiedDate']);

	return res.render('applications/dashboard', {
		cases: readyCases,
		draftCases
	});
}
