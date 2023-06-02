import * as exminationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import { format } from 'date-fns';

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getExaminationTimetableItems = async (_request, response) => {
	const { caseId } = _request.params;
	try {
		const examinationTimetableItems = await exminationTimetableItemsRepository.getByCaseId(+caseId);
		response.send(examinationTimetableItems);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getExaminationTimetableItem = async (_request, response) => {
	const { id } = _request.params;
	const examinationTimetableItem = await exminationTimetableItemsRepository.getById(+id);

	response.send(examinationTimetableItem);
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const createExaminationTimetableItem = async (_request, response) => {
	const { body } = _request;

	// find the examination folder id to create subfolder.
	const examinationFolder = await folderRepository.getFolderByNameAndCaseId(
		body.caseId,
		'Examination'
	);

	if (!examinationFolder) {
		throw new Error(`Examination folder not found for the case ${body.caseId}`);
	}

	const examinationTimetableItem = await exminationTimetableItemsRepository.create(body);
	// Create sub folder for the examination timetable item.
	const folderName = `${format(new Date(examinationTimetableItem.date), 'dd MMM yyyy')} - ${
		examinationTimetableItem.name
	}`;

	const folder = {
		displayNameEn: folderName,
		caseId: body.caseId,
		parentFolderId: examinationFolder.id,
		displayOrder: 100
	};

	await folderRepository.createFolder(folder);

	response.send(examinationTimetableItem);
};
