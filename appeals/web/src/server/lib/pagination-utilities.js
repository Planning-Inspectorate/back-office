import { paginationDefaultSettings } from '#appeals/appeal.constants.js';

/**
 * @typedef {Object} PaginationParameters
 * @property {number} pageNumber
 * @property {number} pageSize
 */

/** @typedef {import('qs').ParsedQs} ParsedQs */

/**
 *
 * @param {ParsedQs} query
 * @returns {PaginationParameters}
 */
export const getPaginationParametersFromQuery = (query) => {
	const paginationParameters = {
		pageNumber: paginationDefaultSettings.firstPageNumber,
		pageSize: paginationDefaultSettings.pageSize
	};

	if (query?.pageNumber) {
		paginationParameters.pageNumber = Number.parseInt(String(query.pageNumber), 10);
	}
	if (query?.pageSize) {
		paginationParameters.pageSize = Number.parseInt(String(query.pageSize), 10);
	}

	return paginationParameters;
};
