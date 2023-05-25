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

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getExaminationTimetableItem = async (_request, response) => {
	const { id } = _request.params;
	const examinationTimetableItems = await exminationTimetableItemsRepository.getById(+id);

	response.send(examinationTimetableItems);
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const createExaminationTimetableItem = async (_request, response) => {
	const { body } = _request;
	const examinationTimetableItem = await exminationTimetableItemsRepository.create(body);

	response.send(examinationTimetableItem);
};
