import * as exminationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';
import * as examinationTimetableTypesRepository from '../../repositories/examination-timetable-types.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import { format } from 'date-fns';
import logger from '../../utils/logger.js';

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
		logger.error(error);
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

	const itemFolder = await folderRepository.createFolder(folder);

	if (!itemFolder) {
		throw Error('Failed to create sub folder for the examination item.');
	}

	await createDeadlineSubFolders(examinationTimetableItem, itemFolder.id);

	response.send(examinationTimetableItem);
};

/**
 *
 * @param {import('@pins/api').Schema.ExaminationTimetableItem} examinationTimetableItem
 * @param {Number} parentFolderId
 * @returns
 */
const createDeadlineSubFolders = async (examinationTimetableItem, parentFolderId) => {
	if (!examinationTimetableItem?.description) return;
	const description = JSON.parse(examinationTimetableItem?.description);
	if (!description?.bulletPoints || description?.bulletPoints?.length === 0) {
		logger.info('No bulletpoints, skip creating sub folders');
		return;
	}

	const categoryType = await examinationTimetableTypesRepository.getById(
		examinationTimetableItem.examinationTypeId
	);

	if (
		!categoryType?.name ||
		(categoryType?.name !== 'Deadline' &&
			categoryType?.name !== 'Procedural Deadline (Pre-Examination)')
	) {
		logger.info('Category name does not match to Deadline, skip creating sub folders');
		return;
	}

	/**
	 * @type {Promise<(import('@pins/api').Schema.Folder |null)>[]}
	 */
	const createFolderPromise = [];
	description.bulletPoints.forEach((/** @type {String} */ folderName) => {
		const subFolder = {
			displayNameEn: folderName,
			caseId: examinationTimetableItem.caseId,
			parentFolderId: parentFolderId,
			displayOrder: 100
		};
		createFolderPromise.push(folderRepository.createFolder(subFolder));
	});

	logger.info('Create sub folders');
	await Promise.all(createFolderPromise);
	logger.info('Sub folders created successfully');
};
