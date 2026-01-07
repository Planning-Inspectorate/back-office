import { update } from '#repositories/key-dates.repository.js';
import BackOfficeAppError from '#utils/app-error.js';

/**
 * Updates the existing record for a given case
 *
 * @type {import('express').RequestHandler<{id: number}, any, any, any>}
 */
export const updateFeesForecasting = async ({ body, params }, response) => {
	const { id } = params;
	const convertedCaseId = Number(id);

	try {
		const updatedCase = await update(convertedCaseId, body);
		return response.status(200).send(updatedCase);
	} catch (error) {
		if (error?.code === 'P2025') {
			throw new BackOfficeAppError(`Case ${convertedCaseId} not found`, 404);
		} else {
			throw new BackOfficeAppError(`Error updating case ${convertedCaseId}`, 500);
		}
	}
};
