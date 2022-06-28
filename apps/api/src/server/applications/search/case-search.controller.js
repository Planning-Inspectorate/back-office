// import { request } from 'express';
import * as applicationRepository from '../../repositories/application.repository.js';
import { mapApplicationWithSearchCriteria } from '../../utils/mapping/map-application-with-search-criteria.js';

/**
 * @typedef {{id: number, reference: string, modifiedDate: number, title: string, description: string, status: string}} ApplicationWithSearchCriteriaResponse
 */

/**
 * @param {import('@pins/api').Schema.Application[]} applications
 * @returns {ApplicationWithSearchCriteriaResponse}
 */
const mapApplicationsWithSearchCriteria = (applications) => {
	return applications.map((application) => mapApplicationWithSearchCriteria(application));
};

export const getApplicationsByCriteria = async (_request, response) => {
	// const validRoles = ['inspector', 'case-manager', 'case-officer'];

	// if (!validRoles.includes(_request.role)) {
	// 	throw new Error('403 - Role is not valid');
	// }

	const applications = await applicationRepository.getBySearchCriteria(_request.body.query);

	return response.send(mapApplicationsWithSearchCriteria(applications));
};
