import { update } from '#repositories/key-dates.repository.js';
import * as caseRepository from '#repositories/case.repository.js';
import BackOfficeAppError from '#utils/app-error.js';
import { EventType } from '@pins/event-client';
import { broadcastNsipProjectEvent } from '#infrastructure/event-broadcasters.js';

/**
 * Updates the existing record for a given case
 *
 * @type {import('express').RequestHandler<{id: number}, any, any, any>}
 */
export const updateFeesForecasting = async ({ body, params }, res) => {
	const { id } = params;
	const caseId = Number(id);

	let updatedFeesForecastingData;

	try {
		updatedFeesForecastingData = await update(caseId, body);
	} catch (error) {
		if (error?.code === 'P2025') {
			throw new BackOfficeAppError(`Case ${caseId} not found`, 404);
		}
	}

	if (!updatedFeesForecastingData) {
		throw new BackOfficeAppError(`Error updating case ${caseId}`, 500);
	}

	const project = await caseRepository.getById(caseId, {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		projectTeam: true,
		gridReference: true,
		invoice: true,
		meeting: true
	});

	if (!project) {
		throw new BackOfficeAppError(`Case ${caseId} not found`, 404);
	}

	await broadcastNsipProjectEvent(project, EventType.Update);

	return res.send(updatedFeesForecastingData);
};
