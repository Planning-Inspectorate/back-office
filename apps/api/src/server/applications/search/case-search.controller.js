import { obtainSearchResults } from './case-search.services.js';

/**
 * @type {import('express').RequestHandler}
 */
export const getApplicationsByCriteria = async (_request, response) => {
	const searchResults = await obtainSearchResults(_request);

	response.send(searchResults);
};
