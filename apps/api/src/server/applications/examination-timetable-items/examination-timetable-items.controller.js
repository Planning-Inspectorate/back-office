import * as examinationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';
import * as examinationTimetableRepository from '../../repositories/examination-timetable.repository.js';
import * as examinationTimetableTypesRepository from '../../repositories/examination-timetable-types.repository.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import { format } from 'date-fns';
import logger from '../../utils/logger.js';
import { mapUpdateExaminationTimetableItemRequest } from '../../utils/mapping/map-examination-timetable-item.js';

/** @typedef {import('@pins/api').Schema.Folder} Folder */

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getExaminationTimetableItems = async (_request, response) => {
	const { caseId } = _request.params;
	try {
		const examinationTimetable = await examinationTimetableRepository.getByCaseId(+caseId);

		if (!examinationTimetable) {
			// @ts-ignore
			return response.send([]);
		}

		const examinationTimetableItems =
			await examinationTimetableItemsRepository.getByExaminationTimetableId(
				examinationTimetable.id
			);

		if (!examinationTimetableItems || examinationTimetableItems.length === 0) {
			// @ts-ignore
			return response.send({ ...examinationTimetable, items: [] });
		}

		const examinationTimetableItemsForCase = [];
		for (const examinationTimetableItem of examinationTimetableItems) {
			const submissions = await validateSubmissions(
				examinationTimetableItem,
				examinationTimetable.caseId
			);
			examinationTimetableItemsForCase.push({ ...examinationTimetableItem, submissions });
		}

		const examinationTimetableResponse = {
			...examinationTimetable,
			items: examinationTimetableItemsForCase
		};
		response.send(examinationTimetableResponse);
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

	if (!examinationTimetableItem) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `Examination timetable item with id: ${id} not found.` } });
	}

	// @ts-ignore
	const caseId = examinationTimetableItem.ExaminationTimetable.caseId;
	const submissions = await validateSubmissions(examinationTimetableItem, caseId);
	response.send({ ...examinationTimetableItem, submissions });
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const createExaminationTimetableItem = async (_request, response) => {
	const { body } = _request;

	let examinationTimetable = await examinationTimetableRepository.getByCaseId(body.caseId);

	if (!examinationTimetable) {
		// @ts-ignore
		examinationTimetable = await examinationTimetableRepository.create({
			caseId: body.caseId,
			published: body.published
		});
	}

	// find the examination folder id to create subfolder.
	const examinationFolder = await folderRepository.getFolderByNameAndCaseId(
		body.caseId,
		'Examination timetable'
	);

	if (!examinationFolder) {
		throw new Error(`Examination folder not found for the case ${body.caseId}`);
	}

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
	body.examinationTimetableId = examinationTimetable.id;
	delete body.caseId;
	delete body.published;
	const examinationTimetableItem = await examinationTimetableItemsRepository.create(body);

	await createDeadlineSubFolders(
		examinationTimetableItem,
		itemFolder.id,
		examinationTimetable.caseId
	);

	response.send(examinationTimetableItem);
};

/**
 *
 * @param {import('@pins/api').Schema.ExaminationTimetableItem} examinationTimetableItem
 * @param {Number} parentFolderId
 * @param {Number} caseId
 * @returns
 */
const createDeadlineSubFolders = async (examinationTimetableItem, parentFolderId, caseId) => {
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
	 * @type {Promise<(Folder |null)>[]}
	 */
	const createFolderPromise = [];

	// create Other sub folder
	const otherFolder = {
		displayNameEn: 'Other',
		caseId,
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
			caseId,
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
 * Deletes all the sub folders in a exam timetable folder, assumption is that all folders are empty.
 * eg for deadline exams, deletes all line item folders and the "Other" folder
 *
 * @param {Number} caseId
 * @param {Number} parentFolderId
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.BatchPayload>}
 */
const deleteDeadlineSubFolders = async (caseId, parentFolderId) => {
	const subFolders = await folderRepository.getByCaseId(caseId, parentFolderId);

	if (!subFolders) {
		logger.info(`No sub folder found for the parent folder Id ${parentFolderId}`);
		return;
	}

	const idsToDelete = [];
	for (const /** @type {Folder} */ folder of subFolders) {
		idsToDelete.push(folder.id);
	}
	await folderRepository.deleteFolderMany(idsToDelete);
	logger.info(`Sub folders deleted successfully in folder: ${parentFolderId}`);
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const publishExaminationTimetable = async (_request, response) => {
	const { id } = _request.params;
	try {
		await examinationTimetableRepository.updateByCaseId(
			+id,
			// @ts-ignore
			{
				published: true,
				publishedAt: new Date()
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
	// @ts-ignore
	const caseId = examinationTimetableItem.ExaminationTimetable.caseId;
	const hasSubmissions = await validateSubmissions(examinationTimetableItem, caseId);

	if (hasSubmissions) {
		logger.info(`Examination timetable item with id: ${id} has submission.`);
		// @ts-ignore
		return response
			.status(400)
			.json({ errors: { message: 'Can not delete examination timetable item.' } });
	}

	await examinationTimetableItemsRepository.deleteById(+id);

	logger.info(`delete subfolder for folder Id ${examinationTimetableItem.folderId}`);
	await deleteDeadlineSubFolders(
		// @ts-ignore
		examinationTimetableItem.ExaminationTimetable.caseId,
		examinationTimetableItem.folderId
	);

	logger.info(`delete folder Id ${examinationTimetableItem.folderId}`);
	await folderRepository.deleteById(examinationTimetableItem.folderId);

	// @ts-ignore
	await examinationTimetableRepository.update(examinationTimetableItem.examinationTimetableId, {
		updatedAt: new Date()
	});

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

	const timetableBeforeUpdate = await examinationTimetableItemsRepository.getById(+id);

	if (!timetableBeforeUpdate) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `Examination timetable item with id: ${id} not found.` } });
	}

	// @ts-ignore
	const caseId = timetableBeforeUpdate.ExaminationTimetable.caseId;
	const hasSubmissions = await validateSubmissions(timetableBeforeUpdate, caseId);

	if (hasSubmissions) {
		logger.info(`Examination timetable item with id: ${id} has submission.`);
		// @ts-ignore
		return response
			.status(400)
			.json({ errors: { message: 'Can not delete examination timetable item.' } });
	}

	const mappedExamTimetableDetails = mapUpdateExaminationTimetableItemRequest(body);
	const updatedExaminationTimetableItem = await examinationTimetableItemsRepository.update(
		+id,
		mappedExamTimetableDetails
	);

	if (
		timetableBeforeUpdate.name !== mappedExamTimetableDetails.name ||
		timetableBeforeUpdate.date !== mappedExamTimetableDetails.date
	) {
		const newFolderName = `${format(new Date(mappedExamTimetableDetails.date), 'dd MMM yyyy')} - ${
			mappedExamTimetableDetails.name
		}`;
		const newDisplayOrder = +format(new Date(mappedExamTimetableDetails.date), 'yyyyMMdd');
		await folderRepository.updateFolderById(timetableBeforeUpdate.folderId, {
			displayNameEn: newFolderName,
			displayOrder: newDisplayOrder
		});
	}

	if (timetableBeforeUpdate.description !== mappedExamTimetableDetails.description) {
		// @ts-ignore
		const caseId = timetableBeforeUpdate.ExaminationTimetable.caseId;
		logger.info('Delete sub folders');
		await deleteDeadlineSubFolders(caseId, timetableBeforeUpdate.folderId);
		logger.info('Create new sub folders');
		await createDeadlineSubFolders(
			updatedExaminationTimetableItem,
			timetableBeforeUpdate.folderId,
			caseId
		);
	}

	// @ts-ignore
	await examinationTimetableRepository.update(
		updatedExaminationTimetableItem.examinationTimetableId,
		{
			updatedAt: new Date()
		}
	);

	response.send(updatedExaminationTimetableItem);
};

/**
 *
 * @param {import('@prisma/client').ExaminationTimetableItem} timetableItem
 * @param {Number} caseId
 * @returns
 */
const validateSubmissions = async (timetableItem, caseId) => {
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

	const subFolders = await folderRepository.getByCaseId(caseId, timetableItem.folderId);
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
