import * as caseRepository from '../../repositories/case.repository.js';
import { mapApplicationWithSearchCriteria } from '../../utils/mapping/map-application-with-search-criteria.js';

/**
 * @typedef {{id: number, reference: string | null, modifiedDate: number, title: string | null, description: string, status: string | object}} ApplicationWithSearchCriteriaResponse
 * @typedef {{page:number, pageSize: number, pageCount: number, itemCount: number, items: ApplicationWithSearchCriteriaResponse[]}} paginationInfo
 */

/**
 * @param {import('@pins/api').Schema.Case[]} applications
 * @returns {ApplicationWithSearchCriteriaResponse[]}
 */
const mapApplicationsWithSearchCriteria = (applications) => {
	return applications.map((application) => mapApplicationWithSearchCriteria(application));
};

/**
 *
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {number}
 */
const getSkipValue = (pageNumber, pageSize) => {
	return (pageNumber - 1) * pageSize;
};

/**
 * @param {string} query
 * @returns {string}
 */
const tidyQuery = (query) => {
	return query.trim();
};

/**
 *
 * @param {number} applicationsCount
 * @param {number} pageSize
 * @returns {number}
 */
const getPageCount = (applicationsCount, pageSize) => {
	return Math.ceil(applicationsCount / pageSize);
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
