import { EventType } from '@pins/event-client';
import * as keyDatesRepository from '../../repositories/key-dates.repository.js';
import * as caseRepository from '../../repositories/case.repository.js';
import BackOfficeAppError from '../../utils/app-error.js';
import { mapRequestToKeyDates, mapKeyDatesToResponse } from '../../utils/mapping/map-key-dates.js';
import { setCaseUnpublishedChangesIfTrue } from '../../utils/published-case-fields-changed.js';
import { broadcastNsipProjectEvent } from '#infrastructure/event-broadcasters.js';

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

	const queryOptions = {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		applicant: true,
		gridReference: true,
		projectTeam: true
	};

	const originalCase = await caseRepository.getById(id, queryOptions);
	if (!originalCase) {
		throw new BackOfficeAppError(`No case found with id ${id}`, 404);
	}

	const updateResponse = await keyDatesRepository.update(id, keyDates);

	let updatedCase = await caseRepository.getById(id, queryOptions);
	if (!updatedCase) {
		throw new BackOfficeAppError(`An error occurred while updating case with id ${id}`, 500);
	}

	updatedCase = await setCaseUnpublishedChangesIfTrue(originalCase, updatedCase);

	await broadcastNsipProjectEvent(updatedCase, EventType.Update);

	const mappedKeyDates = mapKeyDatesToResponse(updateResponse);

	response.send(mappedKeyDates);
};
