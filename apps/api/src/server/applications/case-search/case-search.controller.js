import * as applicationRepository from '../../repositories/application.repository.js';
import { mapApplicationWithSeachCriteria} from '../../utils/mapping/map-application-with-sector-and-subsector.js';

/**
 * @typedef {{id: number, modifiedDate: number, reference: string, state: string, PublishDate: number}} ApplicationWithSearchCriteria
 */

/**
 *
 * @param {import('@pins/api').Schema.Application[]} applications
 * @returns {ApplicationWithSearchCriteria[]}
 */
 const getBySearchCriteria = (applications) => {
	return applications.map((application) => mapApplicationWithSeachCriteria(application));
};
export const getApplications = async (_request, response) => {
	const applications = await applicationRepository.getBySearchCriteria(searchCriteria);

	return response.send(mapApplicationsByCriteria(applications));
};
