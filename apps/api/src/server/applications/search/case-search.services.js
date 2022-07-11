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

export const obtainSearchResults = async (_request) => {
	// default
	const maxResultsPerPage = 20;

	let skipValue = 0;
	let resultsPerPage = maxResultsPerPage;

	if (_request.body.pageSize) {
		resultsPerPage = _request.body.pageSize;
	}
	else {
		// value was undefined - use default
		resultsPerPage = maxResultsPerPage;
	}
	if (_request.body.pageNumber) {
		skipValue = (_request.body.pageNumber - 1) * resultsPerPage;
	}
	else {
		// value was undefined - use default
		skipValue = 0;
	}

	const applications = await caseRepository.getBySearchCriteria(
		_request.body.query.trim(),
		skipValue,
		Number(resultsPerPage)
	);

	const applicationsCount = await caseRepository.getApplicationsCountBySearchCriteria(
		_request.body.query.trim()
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
