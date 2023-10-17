import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';
import { broadcastAppealState } from '#endpoints/integrations/integrations.service.js';
import appealTimetableRepository from '#repositories/appeal-timetable.repository.js';
import logger from '#utils/logger.js';
import { AUDIT_TRAIL_CASE_TIMELINE_UPDATED, ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const updateAppealTimetableById = async (req, res) => {
	const { body, params } = req;
	const appealTimetableId = Number(params.appealTimetableId);

	try {
		await appealTimetableRepository.updateAppealTimetableById(appealTimetableId, body);

		await createAuditTrail({
			appealId: Number(params.appealId),
			azureAdUserId: req.get('azureAdUserId'),
			details: AUDIT_TRAIL_CASE_TIMELINE_UPDATED
		});

		await broadcastAppealState(Number(params.appealId));
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { updateAppealTimetableById };
