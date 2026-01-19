import { update } from '#repositories/key-dates.repository.js';
import BackOfficeAppError from '#utils/app-error.js';

/**
 * Updates the existing record for a given case
 *
 * @type {import('express').RequestHandler<{id: number}, any, any, any>}
 */
export const updateFeesForecasting = async ({ body, params }, response) => {
	const { id } = params;
	const convertedId = Number(id);

	try {
		const updatedFeesForecastingData = await update(convertedId, body);
		return response.status(200).send(updatedFeesForecastingData);
	} catch (error) {
		if (error?.code === 'P2025') {
			throw new BackOfficeAppError(`Case ${convertedId} not found`, 404);
		} else {
			throw new BackOfficeAppError(`Error updating case ${convertedId}`, 500);
		}
	}
};
