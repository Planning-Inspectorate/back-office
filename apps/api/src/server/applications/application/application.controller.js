import { filter } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { mapCreateApplicationRequestToRepository } from './application.mapper.js';

/**
 * @type {import('express').RequestHandler}
 */
export const createApplication = async (request, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(request.body);

	const application = await caseRepository.createApplication(mappedApplicationDetails);

	response.send({ id: application.id });
};

/**
 *
 * @param {import('@pins/api').Schema.BatchPayload} updateResponse
 * @returns {import('@pins/api').Schema.Case}
 */
const getCaseAfterUpdate = (updateResponse) => {
	return filter(updateResponse, (result) => {
		return typeof result.id !== 'undefined';
	})[0];
};

/**
 * @type {import('express').RequestHandler}
 */
export const updateApplication = async (request, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(request.body);

	const updateResponse = await caseRepository.updateApplication({
		caseId: Number.parseInt(request.params.id, 10),
		applicantId: request.body.applicant?.id,
		...mappedApplicationDetails
	});

	const updatedCase = getCaseAfterUpdate(updateResponse);

	response.send({ id: updatedCase.id });
};
