import { obtainSearchResults } from './case-search.services.js';

/**
 *
 * @param {import('express').Request<{query: string, pageNumber?: number, pageSize?: number, role: string}>} _request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export const getApplicationsByCriteria = async ({ body }, response) => {
	const { query, pageNumber, pageSize } = body;

	const searchResults = await obtainSearchResults(query, pageNumber, pageSize);

	response.send(searchResults);
};
