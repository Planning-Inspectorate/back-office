import * as service from './examination-timetable.service.js';
import BackOfficeAppError from '#utils/app-error.js';

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getExaminationTimetableByCaseId = async (req, res) => {
	const { caseId } = req.params;

	const timetable = await service.getByCaseId(Number(caseId));

	if (!timetable) {
		throw new BackOfficeAppError(`Examination timetable with id: ${caseId} not found.`, 404);
	}

	res.send(timetable);
};
