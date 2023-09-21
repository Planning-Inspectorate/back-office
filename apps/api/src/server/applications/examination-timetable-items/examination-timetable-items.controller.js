import * as examinationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';
import * as examinationTimetableRepository from '../../repositories/examination-timetable.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import BackOfficeAppError from '../../utils/app-error.js';
import { format } from 'date-fns';
import logger from '../../utils/logger.js';
import { mapUpdateExaminationTimetableItemRequest } from '../../utils/mapping/map-examination-timetable-item.js';
import * as service from './examination-timetable-items.service.js';

/** @typedef {import('@pins/applications.api').Schema.Folder} Folder */

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 */
export const getExaminationTimetableItems = async ({ params }, response) => {
	const { caseId } = params;

	const examinationTimetable = await examinationTimetableRepository.getByCaseId(Number(caseId));
	if (!examinationTimetable) {
		response.send([]);
		return;
	}

	const examinationTimetableItems =
		await examinationTimetableItemsRepository.getByExaminationTimetableId(examinationTimetable.id);

	if (!examinationTimetableItems || examinationTimetableItems.length === 0) {
		response.send({ ...examinationTimetable, items: [] });
		return;
	}

	const examinationTimetableItemsForCase = await Promise.all(
		examinationTimetableItems.map(
			(item) =>
				new Promise((resolve, reject) => {
					service
						.validateSubmissions(item, examinationTimetable.caseId)
						.then((submissions) => resolve({ ...item, submissions }))
						.catch(reject);
				})
		)
	);

	const examinationTimetableResponse = {
		...examinationTimetable,
		items: examinationTimetableItemsForCase
	};

	response.send(examinationTimetableResponse);
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
		throw new BackOfficeAppError(`Examination timetable item with id: ${id} not found.`, 404);
	}

	// @ts-ignore
	const caseId = examinationTimetableItem.ExaminationTimetable.caseId;
	const submissions = await service.validateSubmissions(examinationTimetableItem, caseId);

	response.send({ ...examinationTimetableItem, submissions });
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const createExaminationTimetableItem = async ({ body }, response) => {
	let examinationTimetable = await examinationTimetableRepository.getByCaseId(body.caseId);
	if (!examinationTimetable) {
		// @ts-ignore
		examinationTimetable = await examinationTimetableRepository.create({
			caseId: body.caseId,
			published: body.published
		});
	}

	const examinationFolder = await folderRepository.getFolderByNameAndCaseId(
		body.caseId,
		'Examination timetable'
	);

	if (!examinationFolder) {
		throw new BackOfficeAppError(`Examination folder not found for the case ${body.caseId}`, 404);
	}

	const folderName = `${format(new Date(body.date), 'dd MMM yyyy')} - ${body.name}`;
	const displayOrder = Number(format(new Date(body.date), 'yyyyMMdd'));
	const folder = {
		displayNameEn: folderName?.trim(),
		caseId: body.caseId,
		parentFolderId: examinationFolder.id,
		displayOrder
	};

	const itemFolder = await folderRepository.createFolder(folder);
	if (!itemFolder) {
		throw new BackOfficeAppError('Failed to create sub folder for the examination item.', 500);
	}

	body.folderId = itemFolder.id;
	body.examinationTimetableId = examinationTimetable.id;
	delete body.caseId;
	delete body.published;
	const examinationTimetableItem = await examinationTimetableItemsRepository.create(body);

	await service.createDeadlineSubFolders(
		examinationTimetableItem,
		itemFolder.id,
		examinationTimetable.caseId
	);

	response.send(examinationTimetableItem);
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const publishExaminationTimetable = async ({ params }, response) => {
	const { id } = params;

	const examinationTimetable = await examinationTimetableRepository.getByCaseId(Number(id));
	if (!examinationTimetable) {
		throw new BackOfficeAppError(`Examination timetable item with id: ${id} not found.`, 404);
	}

	await service.publish(examinationTimetable.id);

	response.send({ success: true });
};

/**
 * Unpublishes an exam timetable on a case
 *
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const unpublishExaminationTimetable = async ({ params }, response) => {
	const { id } = params;

	const examinationTimetable = await examinationTimetableRepository.getByCaseId(Number(id));
	if (!examinationTimetable) {
		throw new BackOfficeAppError(`Examination timetable item with id: ${id} not found.`, 404);
	}

	await service.unPublish(examinationTimetable.id);

	response.send({ success: true });
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const deleteExaminationTimetableItem = async ({ params }, response) => {
	const { id } = params;
	const examinationTimetableItem = await examinationTimetableItemsRepository.getById(+id);

	if (!examinationTimetableItem) {
		throw new BackOfficeAppError(`Examination timetable item with id: ${id} not found.`, 404);
	}

	// @ts-ignore
	const caseId = examinationTimetableItem.ExaminationTimetable.caseId;
	const hasSubmissions = await service.validateSubmissions(examinationTimetableItem, caseId);

	if (hasSubmissions) {
		logger.info(`Examination timetable item with id: ${id} has submission.`);
		throw new BackOfficeAppError('Can not delete examination timetable item.', 400);
	}

	await examinationTimetableItemsRepository.deleteById(Number(id));

	logger.info(`delete subfolder for folder Id ${examinationTimetableItem.folderId}`);
	await service.deleteDeadlineSubFolders(
		// @ts-ignore
		examinationTimetableItem.ExaminationTimetable.caseId,
		examinationTimetableItem.folderId
	);

	logger.info(`delete folder Id ${examinationTimetableItem.folderId}`);
	await folderRepository.deleteById(examinationTimetableItem.folderId);

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
		throw new BackOfficeAppError(`Examination timetable item with id: ${id} not found.`, 404);
	}

	// @ts-ignore
	const caseId = timetableBeforeUpdate.ExaminationTimetable.caseId;
	const hasSubmissions = await service.validateSubmissions(timetableBeforeUpdate, caseId);

	if (hasSubmissions) {
		logger.info(`Examination timetable item with id: ${id} has submission.`);
		throw new BackOfficeAppError('Can not delete examination timetable item.', 400);
	}

	const mappedExamTimetableDetails = mapUpdateExaminationTimetableItemRequest(body);
	const updatedExaminationTimetableItem = await examinationTimetableItemsRepository.update(
		Number(id),
		mappedExamTimetableDetails
	);

	if (
		timetableBeforeUpdate.name !== mappedExamTimetableDetails.name ||
		timetableBeforeUpdate.date !== mappedExamTimetableDetails.date
	) {
		const newFolderName = `${format(new Date(mappedExamTimetableDetails.date), 'dd MMM yyyy')} - ${
			mappedExamTimetableDetails.name
		}`;

		const newDisplayOrder = Number(format(new Date(mappedExamTimetableDetails.date), 'yyyyMMdd'));

		await folderRepository.updateFolderById(timetableBeforeUpdate.folderId, {
			displayNameEn: newFolderName,
			displayOrder: newDisplayOrder
		});
	}

	if (timetableBeforeUpdate.description !== mappedExamTimetableDetails.description) {
		// @ts-ignore
		const caseId = timetableBeforeUpdate.ExaminationTimetable.caseId;

		logger.info('Delete sub folders');
		await service.deleteDeadlineSubFolders(caseId, timetableBeforeUpdate.folderId);

		logger.info('Create new sub folders');
		await service.createDeadlineSubFolders(
			updatedExaminationTimetableItem,
			timetableBeforeUpdate.folderId,
			caseId
		);
	}

	await examinationTimetableRepository.update(
		updatedExaminationTimetableItem.examinationTimetableId,
		{
			updatedAt: new Date()
		}
	);

	response.send(updatedExaminationTimetableItem);
};
