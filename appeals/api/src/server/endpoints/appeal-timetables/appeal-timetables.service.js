import { ERROR_NOT_FOUND } from '../constants.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {Promise<object | void>}
 */
const checkAppealTimetableExists = async (req, res, next) => {
	const {
		appeal,
		params: { appealTimetableId }
	} = req;
	const hasAppealTimetable = appeal.appealTimetable?.id === Number(appealTimetableId);

	if (!hasAppealTimetable) {
		return res.status(404).send({ errors: { appealTimetableId: ERROR_NOT_FOUND } });
	}

	next();
};

export { checkAppealTimetableExists };
