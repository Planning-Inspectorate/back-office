import * as examinationTimetableTypesRepository from '../../repositories/examination-timetable-types.repository.js';
import { getCache, setCache } from '../../utils/cache-data.js';
import { mapExaminationTimetableType } from '../../utils/mapping/map-examination-timetable-type.js';

/**
 *
 * @param {import('@pins/api').Schema.ExaminationTimetableType[]} examinationTimetableTypes
 * @returns {{name: string, displayNameEn: string, displayNameCy: string}[]}
 */
const mapExaminationTimetableTypes = (examinationTimetableTypes) => {
	return examinationTimetableTypes.map((examinationTimetableType) =>
		mapExaminationTimetableType(examinationTimetableType)
	);
};

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

	response.send(mapExaminationTimetableTypes(examinationTimetableTypes));
};
