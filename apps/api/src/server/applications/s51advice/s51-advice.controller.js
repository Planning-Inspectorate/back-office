import * as s51AdviceRepository from '../../repositories/s51-advice.repository.js';

/** @typedef {import('@pins/applications.api').Schema.Folder} Folder */

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const createS51Advice = async (_request, response) => {
	const { body } = _request;

	const s51Advice = await s51AdviceRepository.create(body);

	response.send(s51Advice);
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getS51Advice = async (_request, response) => {
	const { id } = _request.params;

	const s51Advice = await s51AdviceRepository.get(Number(id));

	if (!s51Advice) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `S51 advice with id: ${id} not found.` } });
	}

	response.send(s51Advice);
};
