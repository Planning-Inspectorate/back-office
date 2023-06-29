import * as caseRepository from '../../repositories/case.repository.js';
import { getPageCount, getSkipValue } from '../../utils/database-pagination.js';
import { mapApplicationWithSearchCriteria } from '../../utils/mapping/map-application-with-search-criteria.js';
/**
 * @typedef {import('apps/api/src/server/utils/mapping/map-application-with-search-criteria').ApplicationWithSearchCriteriaResponse} ApplicationWithSearchCriteriaResponse
 * @typedef {{page:number, pageSize: number, pageCount: number, itemCount: number, items: ApplicationWithSearchCriteriaResponse[]}} paginationInfo
 */

/**
 * @param {import('@pins/applications.api').Schema.Case[]} applications
 * @returns {ApplicationWithSearchCriteriaResponse[]}
 */
const mapApplicationsWithSearchCriteria = (applications) => {
	return applications.map((application) => mapApplicationWithSearchCriteria(application));
};

/**
 * @param {string} query
 * @returns {string}
 */
const tidyQuery = (query) => {
	return query.trim();
};

/**
 * @param {string} query
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {Promise<paginationInfo>}
 */
export const obtainSearchResults = async (query, pageNumber = 1, pageSize = 50) => {
	const tidiedQuery = tidyQuery(query);

	const skipValue = getSkipValue(pageNumber, pageSize);

	const applicationsCount = await caseRepository.getApplicationsCountBySearchCriteria(tidiedQuery);

	const applications = await caseRepository.getBySearchCriteria(tidiedQuery, skipValue, pageSize);

	return {
		page: pageNumber,
		pageSize: applications.length,
		pageCount: getPageCount(applicationsCount, pageSize),
		itemCount: applicationsCount,
		items: mapApplicationsWithSearchCriteria(applications)
	};
};
