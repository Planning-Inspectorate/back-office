import * as caseRepository from '../../repositories/case.repository.js';
import { mapApplicationWithSearchCriteria } from '../../utils/mapping/map-application-with-search-criteria.js';

/**
 * @typedef {{id: number, reference: string, modifiedDate: number, title: string, description: string, status: string}} ApplicationWithSearchCriteriaResponse
 * @typedef {{page:number, pageSize: number, pageCount: number, itemCount: number, items: object}} paginationInfo
 */

/**
 * @param {import('@pins/api').Schema.Case[]} applications
 * @returns {ApplicationWithSearchCriteriaResponse[]}
 */
const mapApplicationsWithSearchCriteria = (applications) => {
	return applications.map((application) => mapApplicationWithSearchCriteria(application));
};

/**
 * @param {*} _request
 * @returns {Promise<paginationInfo>}
 */
export const obtainSearchResults = async (_request) => {
	// default
	const maxResultsPerPage = 20;

	let skipValue = 0;
	let resultsPerPage = maxResultsPerPage;

	resultsPerPage = _request.body.pageSize ? _request.body.pageSize : maxResultsPerPage;
	skipValue = _request.body.pageNumber ? (_request.body.pageNumber - 1) * resultsPerPage : 0;

	const applicationsCount = await caseRepository.getApplicationsCountBySearchCriteria(
		_request.body.query.trim()
	);

	if (resultsPerPage > applicationsCount) {
		resultsPerPage = applicationsCount;
	}

	const applications = await caseRepository.getBySearchCriteria(
		_request.body.query.trim(),
		skipValue,
		resultsPerPage
	);

	// return zero data if no results found
	let pageInfo = {
		page: 1,
		pageSize: 0,
		pageCount: 0,
		itemCount: 0,
		items: []
	};

	if (applications) {
		pageInfo = {
			page: skipValue / resultsPerPage + 1,
			pageSize: applications.length,
			pageCount: Math.ceil(applicationsCount / resultsPerPage),
			itemCount: applicationsCount,
			items: mapApplicationsWithSearchCriteria(applications)
		};
	}

	return pageInfo;
};
