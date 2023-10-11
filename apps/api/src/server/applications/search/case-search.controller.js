import { obtainSearchResults } from './case-search.services.js';

/**
 * @typedef {import('@pins/applications.api').Api.ApplicationsSearchCriteriaRequestBody} ApplicationsSearchCriteriaRequestBody
 */

/**
 * @type {import('express').RequestHandler<any, any, ApplicationsSearchCriteriaRequestBody>}
 */
export const getApplicationsByCriteria = async ({ body }, response) => {
	const { query, pageNumber, pageSize } = body;

	const searchResults = await obtainSearchResults(query, pageNumber, pageSize);

	response.send(searchResults);
};
