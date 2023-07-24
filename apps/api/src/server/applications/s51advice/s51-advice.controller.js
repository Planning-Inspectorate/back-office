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
