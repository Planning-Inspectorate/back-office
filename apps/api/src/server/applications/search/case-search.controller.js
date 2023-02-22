import { obtainSearchResults } from './case-search.services.js';

/**
 * @type {import('express').RequestHandler<any, any, {query: string, pageNumber?: number, pageSize?: number, role: string}>}
 */
export const getApplicationsByCriteria = async ({ body }, response) => {
	const { query, pageNumber, pageSize } = body;

	const searchResults = await obtainSearchResults(query, pageNumber, pageSize);

	response.send(searchResults);
};
