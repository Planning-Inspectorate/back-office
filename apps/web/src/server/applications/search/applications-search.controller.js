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
 * @property {SearchApplicationItem[]} searchResults
 * @property {ViewSearchResultsErrors=} searchApplicationsError
 * @property {string=} query
 * @property {DomainType} domainType
 */

/**
 * Search applications.
 *
 * @type {import('@pins/express').RenderHandler<SearchApplicationsRenderProps,
  {}, SearchApplicationsRequestBody, {}, DomainParams>} */
export async function searchApplications(req, response) {
	const { errors, body } = req;
	const { query, role } = body;

	if (errors) {
		const searchApplicationsError = errors.query?.msg ? { text: errors.query?.msg } : false;

		return response.render('applications/search-results', {
			searchApplicationsError,
			domainType: role,
			searchResults: []
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
	const resultApplications = searchResponse?.items || [];

	return response.render('applications/search-results', {
		searchResults: resultApplications,
		domainType: role,
		query
	});
}
