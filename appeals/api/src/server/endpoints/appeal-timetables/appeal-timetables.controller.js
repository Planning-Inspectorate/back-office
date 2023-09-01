import appealTimetableRepository from '#repositories/appeal-timetable.repository.js';
import logger from '#utils/logger.js';

import { ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('express').Response} Response */

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
const updateAppealTimetableById = async (req, res) => {
	const { body, params } = req;
	const appealTimetableId = Number(params.appealTimetableId);

	try {
		await appealTimetableRepository.updateAppealTimetableById(appealTimetableId, body);
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { updateAppealTimetableById };
