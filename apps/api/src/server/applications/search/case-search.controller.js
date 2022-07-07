import { obtainSearchResults } from './case-search.services.js';

/**
 *
 * @param {*} _request
 * @param {*} response
 */
export const getApplicationsByCriteria = async (_request, response) => {
	const searchResults = await obtainSearchResults(_request);

	return response.send(searchResults);
};
