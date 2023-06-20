import * as examinationTimetableTypesRepository from '../../repositories/examination-timetable-types.repository.js';
import { getCache, setCache } from '../../utils/cache-data.js';

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getExaminationTimetableTypes = async (_request, response) => {
	let examinationTimetableTypes = getCache('examination-timetable-type');

	if (!examinationTimetableTypes) {
		examinationTimetableTypes = await examinationTimetableTypesRepository.getAll();

		setCache('examination-timetable-type', examinationTimetableTypes);
	}

	response.send(examinationTimetableTypes);
};
