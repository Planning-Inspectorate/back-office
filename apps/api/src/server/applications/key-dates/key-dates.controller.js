import * as keyDatesRepository from '../../repositories/key-dates.repository.js';
import BackOfficeAppError from '../../utils/app-error.js';
import { mapRequestToKeyDates, mapKeyDatesToResponse } from './key-dates.mapper.js';

/**
 * Get key dates for a project
 * @type {import('express').RequestHandler}
 *
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getKeyDates = async (request, response) => {
	const { id } = request.params;

	const keyDates = await keyDatesRepository.get(Number(id));

	if (!keyDates) {
		throw new BackOfficeAppError(`Key dates for case ${id} not found`, 404);
	}

	const mappedKeyDates = mapKeyDatesToResponse(keyDates);

	response.send(mappedKeyDates);
};

/**
 * Update key dates for a Project
 *
 * @type {import('express').RequestHandler<{id: number}, any, any, any>}
 */
export const updateKeyDates = async ({ body, params }, response) => {
	const { id } = params;

	const keyDates = mapRequestToKeyDates(body);

	const updateResponse = await keyDatesRepository.update(id, keyDates);

	// TODO BOAS-685: Service Bus Message Update

	const mappedKeyDates = mapKeyDatesToResponse(updateResponse);

	response.send(mappedKeyDates);
};
