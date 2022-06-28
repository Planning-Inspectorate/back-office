// import { request } from 'express';
import * as applicationRepository from '../../repositories/application.repository.js';
import { mapApplicationWithSearchCriteria } from '../../utils/mapping/map-application-with-search-criteria.js';

/**
 * @typedef {{id: number, reference: string, title: string, description: string, state: string, modifiedDate: number, stage: string}} ApplicationWithSearchCriteriaResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Application[]} applications
 * @returns {ApplicationWithSearchCriteriaResponse}
 */
const mapApplicationsWithSearchCriteria = (applications) => {
	return applications.map((application) => mapApplicationWithSearchCriteria(application));
};

export const getApplications = async (_request, response) => {
	const applications = await applicationRepository.getBySearchCriteria(_request.searchCriteria);

	return response.send(mapApplicationsWithSearchCriteria(applications));
};
