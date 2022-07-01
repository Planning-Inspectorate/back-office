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
	const validRoles = ['inspector', 'case-officer', 'case-admin-officer'];
	const MAXRESULTS_PERPAGE = 20;
	const MAX_PAGES = 30;

	let skipValue = 0;
	let resultsPerPage = MAXRESULTS_PERPAGE;

	if (_request.body.query === '') {
		throw new Error('ERROR 400 - query cannot be blank');
	}
	if (!validRoles.includes(_request.body.role)) {
		throw new Error('ERROR 403 - Role is not valid');
	}
	if (_request.body.pageSize != null) {
		if (_request.body.pageSize < 1 || _request.body.pageSize > MAXRESULTS_PERPAGE) {
			throw new Error('ERROR 400 - pageSize not in valid range');
		} else {
			resultsPerPage = _request.body.pageSize;
		}
	}
	if (_request.body.pageNumber != null) {
		if (_request.body.pageNumber < 1 || _request.body.pageNumber > MAX_PAGES) {
			throw new Error('ERROR 400 - pageNumber not in valid range');
		} else {
			skipValue = (_request.body.pageNumber - 1) * resultsPerPage;
		}
	}

	const applications = await applicationRepository.getBySearchCriteria(
		_request.body.query,
		skipValue,
		Number(resultsPerPage)
	);

	const applicationsCount = await applicationRepository.getApplicationsCountBySearchCriteria(
		_request.body.query
	);

	const pageInfo = {
		page: skipValue / resultsPerPage + 1,
		pageSize: applications.length,
		pageCount: Math.ceil(applicationsCount / _request.body.pageSize),
		itemCount: applicationsCount,
		items: mapApplicationsWithSearchCriteria(applications)
	};

	return response.send(pageInfo);
};
