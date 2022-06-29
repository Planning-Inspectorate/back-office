import * as applicationsService from './application-search.service.js';

/** @typedef {import('../applications.types').ApplicationSummary} ApplicationSummary */
/** @typedef {import('../applications.types').DomainType} DomainType */
/** @typedef {import('../applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications-search.types').SearchApplicationsRequestBody} SearchApplicationsRequestBody */
/** @typedef {import('./applications-search.types').SearchApplicationItem} SearchApplicationItem */

/**
 * @typedef {object|boolean} ViewSearchResultsErrors
 * @property {string} text
 */

/**
 * @typedef {object} SearchApplicationsRenderProps
 * @property {SearchApplicationItem[]=} searchApplicationsItems
 * @property {ViewSearchResultsErrors=} searchApplicationsError
 * @property {string=} query
 */

/**
 * Search applications.
 *
 * @type {import('@pins/express').RenderHandler<SearchApplicationsRenderProps,
  {}, SearchApplicationsRequestBody, {}, DomainParams>} */
export async function searchApplications(req, response) {
	const { errors, body } = req;
	const { query } = body;
	const role = response.locals.domainType;

	if (errors) {
		// TODO: use the errorMsg filter instead
		const searchApplicationsError = errors.query?.msg ? { text: errors.query?.msg } : false;

		return response.render('applications/search-results', {
			searchApplicationsError
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
