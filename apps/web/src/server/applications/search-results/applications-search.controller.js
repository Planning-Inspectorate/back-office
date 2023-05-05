import { url } from '../../lib/nunjucks-filters/index.js';
import * as applicationsService from './application-search.service.js';

/** @typedef {import('./applications-search.types.js').ApplicationsSearchResultsBody} ApplicationsSearchResultsBody */

/** @typedef {import('./applications-search.types.js').ApplicationsSearchResultsProps} ApplicationsSearchResultsProps */

/**
 * Search applications.
 *
  @type {import('@pins/express').RenderHandler<ApplicationsSearchResultsProps, {}, ApplicationsSearchResultsBody, {q: string}, {pageNumber: string}>} */
export async function searchApplications(req, response) {
	const { errors, body, params } = req;
	const { query: bodyQuery } = body;

	const query = bodyQuery ?? req.query.q;

	const role = response.locals.domainType;

	if (errors || !query) {
		return response.render('applications/search-results/search-results', {
			errors: errors || {},
			searchApplicationsItems: [],
			itemCount: 0,
			query
		});
	}

	const pageSize = 1;
	const pageNumber = Number.parseInt(params?.pageNumber, 10) || 1;

	const searchResponse = await applicationsService.searchApplications({
		role,
		query,
		pageSize,
		pageNumber
	});

	const searchApplicationsItems = searchResponse?.items || [];
	const itemCount = searchResponse?.itemCount || 0;
	const pagesNumber = Math.ceil(itemCount / pageSize);

	const pagination = {
		previous:
			pageNumber > 1 ? { href: url('search-results', { step: `${pageNumber - 1}`, query }) } : {},
		next:
			pageNumber < pagesNumber
				? { href: url('search-results', { step: `${pageNumber + 1}`, query }) }
				: {},
		items: Array.from({ length: pagesNumber }).map((value, key) => ({
			number: key + 1,
			current: key + 1 === pageNumber,
			href: url('search-results', { step: `${key + 1}`, query })
		}))
	};

	return response.render('applications/search-results/search-results', {
		searchApplicationsItems,
		query,
		itemCount,
		pagination
	});
}
