import * as applicationRepository from '../../repositories/application.repository.js';
import { mapApplicationWithSearchCriteria } from '../../utils/mapping/map-application-with-search-criteria.js';

/**
 * @typedef {{id: number, reference: string, modifiedDate: number, title: string, description: string, status: string}} ApplicationWithSearchCriteriaResponse
 * @typedef {{page:number, pageSize: number, pageCount: number, itemCount: number, items: object}} paginationInfo
 */

/**
 * @param {import('@pins/api').Schema.Application[]} applications
 * @returns {ApplicationWithSearchCriteriaResponse}
 */
const mapApplicationsWithSearchCriteria = (applications) => {
	return applications.map((application) => mapApplicationWithSearchCriteria(application));
};

export const getApplicationsByCriteria = async (_request, response) => {
	// default
	const maxResultsPerPage = 20;

	let skipValue = 0;
	let resultsPerPage = maxResultsPerPage;

	if (_request.body.pageSize) {
		resultsPerPage = _request.body.pageSize;
	}
	if (_request.body.pageNumber) {
		skipValue = (_request.body.pageNumber - 1) * resultsPerPage;
	}

	const applications = await applicationRepository.getBySearchCriteria(
		_request.body.query.trim(),
		skipValue,
		Number(resultsPerPage)
	);

	const applicationsCount = await applicationRepository.getApplicationsCountBySearchCriteria(
		_request.body.query.trim()
	);

	const pageInfo = {
		page: skipValue / resultsPerPage + 1,
		pageSize: applications.length,
		pageCount: Math.ceil(applicationsCount / resultsPerPage),
		itemCount: applicationsCount,
		items: mapApplicationsWithSearchCriteria(applications)
	};

	return response.send(pageInfo);
};
