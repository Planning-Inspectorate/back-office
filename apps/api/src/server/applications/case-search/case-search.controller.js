import * as applicationRepository from '../../repositories/application.repository.js';

export const getApplications = async (_request, response) => {
	const applications = await applicationRepository.getByCaseID(caseId);

	return response.send(mapApplicationsByCriteria(applications));
};
