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

	// find the examination folder id to create subfolder.
	let examinationFolder = await folderRepository.getFolderByNameAndCaseId(
		body.caseId,
		'Examination'
	);

	if (!examinationFolder) {
		examinationFolder = await folderRepository.createFolder({
			displayNameEn: 'Examination',
			caseId: body.caseId,
			parentFolderId: null,
			displayOrder: 100
		});
	}

	// Create sub folder for the examination timetable item.
	const folderName = `${format(new Date(examinationTimetableItem.date), 'dd MMM yyyy')} - ${
		examinationTimetableItem.name
	}`;

	const folder = {
		displayNameEn: folderName,
		caseId: body.caseId,
		parentFolderId: examinationFolder?.id || null,
		displayOrder: 100
	};

	await folderRepository.createFolder(folder);

	response.send(examinationTimetableItem);
};
