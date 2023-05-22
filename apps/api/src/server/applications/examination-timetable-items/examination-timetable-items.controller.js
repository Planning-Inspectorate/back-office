import * as exminationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getExaminationTimetableItems = async (_request, response) => {
	const { caseId } = _request.params;
	const examinationTimetableItems = await exminationTimetableItemsRepository.getByCaseId(+caseId);

	response.send(examinationTimetableItems);
};
