import * as applicationRepository from '../../repositories/application.repository.js';
import { mapApplicationWithSeachCriteria} from '../../utils/mapping/map-application-with-sector-and-subsector.js';

/**
 * @typedef {{name: string, displayNameEn: string, displayNameCy: string, abbreviation: string}} SectorResponse
 * @typedef {{id: number, modifiedDate: number, reference: string, sector: SectorResponse, subSector: SectorResponse}} ApplicationWithSectorResponse
 */

/**
 *
 * @param {import('@pins/api').Schema.Application[]} applications
 * @returns {ApplicationWithSectorResponse[]}
 */
 const getBySearchCriteria = (applications) => {
	return applications.map((application) => mapApplicationWithSeachCriteria(application));
};
export const getApplications = async (_request, response) => {
	const applications = await applicationRepository.getByCaseID(searchCriteria);

	return response.send(mapApplicationsByCriteria(applications));
};
