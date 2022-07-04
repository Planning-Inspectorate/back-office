import * as applicationsService from './application-search.service.js';

/** @typedef {import('../applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications-search.types').ApplicationsSearchResultsBody} ApplicationsSearchResultsBody */
/** @typedef {import('./applications-search.types').ApplicationsSearchResultsProps} ApplicationsSearchResultsProps */

/**
 * Search applications.
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsSearchResultsProps,
  {}, ApplicationsSearchResultsBody, {}, DomainParams>} */
export async function searchApplications(req, response) {
	const { errors, body } = req;
	const { query } = body;
	const role = response.locals.domainType;

	if (errors) {
		return response.render('applications/search-results', {
			errors
		});
	}

	const pageSize = 20;
	const pageNumber = 1;

	const searchResponse = await applicationsService.searchApplications({
		role,
		query,
		pageSize,
		pageNumber
	});
	const searchApplicationsItems = searchResponse?.items || [];

	return response.render('applications/search-results', {
		searchApplicationsItems,
		query
	});
}
