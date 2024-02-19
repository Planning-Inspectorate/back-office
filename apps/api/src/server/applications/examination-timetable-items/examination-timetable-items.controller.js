import * as examinationTimetableItemsRepository from '#repositories/examination-timetable-items.repository.js';
import * as examinationTimetableRepository from '#repositories/examination-timetable.repository.js';
import * as folderRepository from '#repositories/folder.repository.js';
import * as caseRepository from '#repositories/case.repository.js';
import BackOfficeAppError from '#utils/app-error.js';
import { format } from 'date-fns';
import logger from '#utils/logger.js';
import { mapUpdateExaminationTimetableItemRequest } from '#utils/mapping/map-examination-timetable-item.js';
import {
	mapExaminationTimetableItemDescriptionToSave,
	mapExaminationTimetableItemDescriptionToView
} from '#utils/mapping/map-examination-timetable-item-description.js';
import * as service from './examination-timetable-items.service.js';
import { eventClient } from '#infrastructure/event-client.js';
import { FOLDER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { buildFolderPayload } from '#infrastructure/payload-builders/folder.js';
import { verifyNotTraining } from '../application/application.validators.js';

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
						.then((submissions) =>
							resolve({
								...item,
								submissions,
								description: mapExaminationTimetableItemDescriptionToView(item.description)
							})
						)
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
	const description = mapExaminationTimetableItemDescriptionToView(
		examinationTimetableItem.description
	);

	response.send({ ...examinationTimetableItem, submissions, description });
};

/**
 * Create a new timetable item.  Will also create a parent Timetable record if one does not exist.
 * Will create a matching folder in Examination Timetable folder for this item, and any line item sub folders for Deadline line items.
 *
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
		throw new BackOfficeAppError(`Examination folder not found for the case ${body.caseId}`, 500);
	}

	// check the new timetable item name is unique
	const examinationTimetableMatchingItems =
		await examinationTimetableItemsRepository.getByExaminationTimetableName(
			examinationTimetable.id,
			body.name,
			null
		);

	if (examinationTimetableMatchingItems && examinationTimetableMatchingItems.length > 0) {
		const uniqueErrorMsg = `Examination timetable item name ${body.name} is not unique, please enter a new name`;

		response.status(400).send({ errors: { unique: uniqueErrorMsg } });
		throw new BackOfficeAppError(uniqueErrorMsg, 400);
	}

	const folderName = `${format(new Date(body.date), 'dd MMM yyyy')} - ${body.name}`;
	const displayOrder = Number(format(new Date(body.date), 'yyyyMMdd'));
	const folder = {
		displayNameEn: folderName?.trim(),
		caseId: body.caseId,
		parentFolderId: examinationFolder.id,
		stage: examinationFolder.stage,
		displayOrder
	};

	const itemFolder = await folderRepository.createFolder(folder);
	if (!itemFolder) {
		throw new BackOfficeAppError('Failed to create sub folder for the examination item.', 500);
	}

	const project = await caseRepository.getById(body.caseId, { sector: true });

	// now send broadcast event for folder creation - ignoring folders on training cases.
	try {
		await verifyNotTraining(body.caseId);

		await eventClient.sendEvents(
			FOLDER,
			[buildFolderPayload(itemFolder, project.reference)],
			EventType.Create
		);
	} catch (/** @type {*} */ err) {
		logger.info('Blocked sending event for folder create', err.message);
	}

	body.description = mapExaminationTimetableItemDescriptionToSave(body.description);
	body.folderId = itemFolder.id;
	body.examinationTimetableId = examinationTimetable.id;
	delete body.caseId;
	delete body.published;
	const examinationTimetableItem = await examinationTimetableItemsRepository.create(body);

	await service.createDeadlineSubFolders(
		examinationTimetableItem,
		itemFolder.id,
		itemFolder.stage,
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

	const folder = await folderRepository.getById(examinationTimetableItem.folderId);
	const project = await caseRepository.getById(caseId, { sector: true });

	logger.info(`delete folder Id ${examinationTimetableItem.folderId}`);
	await folderRepository.deleteById(examinationTimetableItem.folderId);

	// now send broadcast event for folder deletion - ignoring folders on training cases.
	try {
		await verifyNotTraining(caseId);

		await eventClient.sendEvents(
			FOLDER,
			[buildFolderPayload(folder, project.reference)],
			EventType.Delete
		);
	} catch (/** @type {*} */ err) {
		logger.info('Blocked sending event for folder delete', err.message);
	}

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

	body.description = mapExaminationTimetableItemDescriptionToSave(body.description);
	const mappedExamTimetableDetails = mapUpdateExaminationTimetableItemRequest(body);

	// if changing the name, check the new timetable item name is unique
	if (timetableBeforeUpdate.name !== mappedExamTimetableDetails.name) {
		const examinationTimetableMatchingItems =
			await examinationTimetableItemsRepository.getByExaminationTimetableName(
				timetableBeforeUpdate.examinationTimetableId,
				body.name,
				+id
			);
		if (examinationTimetableMatchingItems && examinationTimetableMatchingItems.length > 0) {
			const uniqueErrorMsg = `Examination timetable item name ${body.name} is not unique, please enter a new name`;

			response.status(400).send({ errors: { unique: uniqueErrorMsg } });
			throw new BackOfficeAppError(uniqueErrorMsg, 400);
		}
	}

	const updatedExaminationTimetableItem = await examinationTimetableItemsRepository.update(
		Number(id),
		mappedExamTimetableDetails
	);

	// if name or dates have changed, then need to rename matching folders
	let folder;
	if (
		timetableBeforeUpdate.name !== mappedExamTimetableDetails.name ||
		timetableBeforeUpdate.date !== mappedExamTimetableDetails.date
	) {
		const newFolderName = `${format(new Date(mappedExamTimetableDetails.date), 'dd MMM yyyy')} - ${
			mappedExamTimetableDetails.name
		}`;

		const newDisplayOrder = Number(format(new Date(mappedExamTimetableDetails.date), 'yyyyMMdd'));

		folder = await folderRepository.updateFolderById(timetableBeforeUpdate.folderId, {
			displayNameEn: newFolderName,
			displayOrder: newDisplayOrder
		});

		const project = await caseRepository.getById(caseId, { sector: true });
		// now send broadcast event for folder update - ignoring folders on training cases.
		try {
			await verifyNotTraining(caseId);

			await eventClient.sendEvents(
				FOLDER,
				[buildFolderPayload(folder, project.reference)],
				EventType.Update
			);
		} catch (/** @type {*} */ err) {
			logger.info('Blocked sending event for folder update', err.message);
		}
	} else {
		folder = await folderRepository.getById(timetableBeforeUpdate.folderId);
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
			folder.stage,
			caseId
		);
	}

	await examinationTimetableRepository.update(
		updatedExaminationTimetableItem.examinationTimetableId,
		{
			updatedAt: new Date()
		}
	);

	// send a broadcast event for the update (sends whole timetable)
	await service.sendUpdateEvent(updatedExaminationTimetableItem.examinationTimetableId);

	response.send(updatedExaminationTimetableItem);
};
