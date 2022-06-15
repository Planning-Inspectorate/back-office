import * as applicationRepository from '../../repositories/application.repository.js';
import { mapApplicationsWithSectorAndSubSector } from './case-officer.mapper.js';

export const getApplications = async (_request, response) => {
	const applications = await applicationRepository.getByStatus('open');

	return response.send(mapApplicationsWithSectorAndSubSector(applications));
};
