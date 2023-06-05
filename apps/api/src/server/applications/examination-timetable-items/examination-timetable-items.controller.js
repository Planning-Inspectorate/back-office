import * as examinationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';
import * as examinationTimetableTypesRepository from '../../repositories/examination-timetable-types.repository.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import { format } from 'date-fns';
import logger from '../../utils/logger.js';
import { mapUpdateExaminationTimetableItemRequest } from '../../utils/mapping/map-examination-timetable-item.js';

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getExaminationTimetableItems = async (_request, response) => {
	const { caseId } = _request.params;
	try {
		const examinationTimetableItems = await examinationTimetableItemsRepository.getByCaseId(
			+caseId
		);
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
	const examinationTimetableItem = await examinationTimetableItemsRepository.getById(+id);

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
		'Examination timetable'
	);

	if (!examinationFolder) {
		throw new Error(`Examination folder not found for the case ${body.caseId}`);
	}

	const examinationTimetableItem = await examinationTimetableItemsRepository.create(body);
	// Create sub folder for the examination timetable item.
	const folderName = `${format(new Date(body.date), 'dd MMM yyyy')} - ${body.name}`;
	const displayOrder = +format(new Date(body.date), 'yyyyMMdd');
	const folder = {
		displayNameEn: folderName?.trim(),
		caseId: body.caseId,
		parentFolderId: examinationFolder.id,
		displayOrder
	};

	const itemFolder = await folderRepository.createFolder(folder);

	if (!itemFolder) {
		throw Error('Failed to create sub folder for the examination item.');
	}

	body.folderId = itemFolder.id;
	const examinationTimetableItem = await exminationTimetableItemsRepository.create(body);

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

	// create Other sub folder
	const otherFolder = {
		displayNameEn: 'Other',
		caseId: examinationTimetableItem.caseId,
		parentFolderId: parentFolderId,
		displayOrder: 100
	};
	createFolderPromise.push(folderRepository.createFolder(otherFolder));

	if (!description?.bulletPoints || description?.bulletPoints?.length === 0) {
		logger.info('No bulletpoints');
	}

	// create sub folder for each bullet points.
	description.bulletPoints.forEach((/** @type {String} */ folderName) => {
		const subFolder = {
			displayNameEn: folderName?.trim(),
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

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const publishExaminationTimetable = async (_request, response) => {
	const { id } = _request.params;
	try {
		await examinationTimetableItemsRepository.updateByCaseId(
			+id,
			// @ts-ignore
			{
				published: true
			}
		);
		response.send({
			success: true
		});
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
export const deleteExaminationTimetableItem = async (_request, response) => {
	const { id } = _request.params;
	const examinationTimetableItem = await examinationTimetableItemsRepository.getById(+id);

	if (!examinationTimetableItem) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `Examination timetable item with id: ${id} not found.` } });
	}

	if (examinationTimetableItem?.published) {
		// @ts-ignore
		return response
			.status(400)
			.json({ errors: { message: 'Can not delete published examination timetable item.' } });
	}

	await examinationTimetableItemsRepository.deleteById(+id);

	response.send(examinationTimetableItem);
};

/**
 * Updates the properties of a single Examination Timetable Item
 *
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const updateExaminationTimetableItem = async ({ params, body }, response) => {
	const { id } = params;
	const mappedExamTimetableDetails = mapUpdateExaminationTimetableItemRequest(body);
	const examinationTimetableItem = await examinationTimetableItemsRepository.update(
		+id,
		mappedExamTimetableDetails
	);

	response.send(examinationTimetableItem);
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const hasSubmissions = async (_request, response) => {
	const { id } = _request.params;

	const timetableItem = await exminationTimetableItemsRepository.getById(+id);
	if (!timetableItem) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `Examination timetable item with id: ${id} not found.` } });
	}

	const submissions = await validateSubmissions(timetableItem);

	response.send({ submissions });
};

/**
 *
 * @param {import('@prisma/client').ExaminationTimetableItem} timetableItem
 * @returns
 */
const validateSubmissions = async (timetableItem) => {
	const folder = await folderRepository.getById(timetableItem.folderId);
	if (!folder) {
		logger.info('No associated folder found');
		// @ts-ignore
		return false;
	}

	const documents = await documentRepository.countDocumentsInFolder(timetableItem.folderId);
	if (documents && documents > 0) {
		logger.info(`Document found in folder ${timetableItem.folderId}`);
		// @ts-ignore
		return true;
	}

	const subFolders = await folderRepository.getByCaseId(
		timetableItem.caseId,
		timetableItem.folderId
	);
	if (!subFolders || subFolders.length === 0) {
		logger.info(`No sub folder for folder ${timetableItem.folderId}`);
		// @ts-ignore
		return false;
	}
	/**
	 * @type {any[]}
	 */
	const subFoldersDocumentsPromise = [];
	subFolders.forEach((subFolder) => {
		subFoldersDocumentsPromise.push(documentRepository.countDocumentsInFolder(subFolder.id));
	});

	const subfoldersDocuments = await Promise.all(subFoldersDocumentsPromise);

	if (subfoldersDocuments.some((sd) => sd > 0)) {
		logger.info(`Document found for parent folder ${timetableItem.folderId}`);
		// @ts-ignore
		return true;
	}

	logger.info(`Document not found for parent folder ${timetableItem.folderId}`);

	return false;
};
