import * as s51AdviceRepository from '../../repositories/s51-advice.repository.js';
import { getManyS51AdviceOnCase } from './s51-advice.service.js';

/** @typedef {import('@pins/applications.api').Schema.Folder} Folder */

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const createS51Advice = async (_request, response) => {
	const { body } = _request;
	const { caseId } = body;

	const latestReferenceNumber = await s51AdviceRepository.getS51AdviceCountOnCase(caseId);
	const newReferenceNumber = latestReferenceNumber + 1;

	const payload = { ...body, referenceNumber: newReferenceNumber };
	const s51Advice = await s51AdviceRepository.create(payload);

	response.send(s51Advice);
};

/**

 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getS51Advice = async (_request, response) => {
	const { adviceId } = _request.params;

	const s51Advice = await s51AdviceRepository.get(Number(adviceId));

	if (!s51Advice) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `S51 advice with id: ${adviceId} not found.` } });
	}

	response.send(s51Advice);
};

/**
 * Gets paginated array of S51 Advice records on a case
 *
 * @type {import('express').RequestHandler<{ id: number }, ?, {pageNumber?: number, pageSize?: number}, any>}
 */
export const getManyS51Advices = async ({ params, body }, response) => {
	const { id } = params;
	const { pageNumber, pageSize } = body;
	const paginatedS51Advices = await getManyS51AdviceOnCase(id, pageNumber, pageSize);

	response.send(paginatedS51Advices);
};
