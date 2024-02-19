import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_EXAM_TIMETABLE, FOLDER } from '#infrastructure/topics.js';
import * as examinationTimetableRepository from '#repositories/examination-timetable.repository.js';
import * as examinationTimetableTypesRepository from '#repositories/examination-timetable-types.repository.js';
import * as documentRepository from '#repositories/document.repository.js';
import * as folderRepository from '#repositories/folder.repository.js';
import * as caseRepository from '#repositories/case.repository.js';
import logger from '#utils/logger.js';
import { EventType } from '@pins/event-client';
import { verifyNotTrainingExamTimetable } from './examination-timetable-items.validators.js';
import { buildFoldersPayload } from '#infrastructure/payload-builders/folder.js';
import { verifyNotTraining } from '../application/application.validators.js';

/**
 * @typedef {import('pins-data-model').Schemas.Event} NSIPExamTimetableItem
 * @typedef {import('pins-data-model').Schemas.ExaminationTimetable} NSIPExamTimetable
 * @typedef {import('@pins/applications.api').Schema.Folder} Folder
 * @typedef {import('@prisma/client').Prisma.ExaminationTimetableItemGetPayload<{include: {ExaminationTimetableType: true} }>} ExaminationTimetableItemWithType
 */

/**
 * Grabs the description and event line items from the examinationTimetableItem and parses them into a description string and
 * NSIPExamTimetableItemDescriptionLineItem array when the categoryType is Deadline
 *
 * @param {import('@prisma/client').ExaminationTimetableItem} examinationTimetableItem
 * @returns { { description: string, eventLineItems: { description: string }[] | string } }
 */
function extractDescriptionAndLineItems(examinationTimetableItem) {
	const isDeadline = examinationTimetableItem?.ExaminationTimetableType?.name === 'Deadline';

	if (!examinationTimetableItem.description) {
		return {
			description: '',
			eventLineItems: []
		};
	}

	/** @type {{ preText: string, bulletPoints: string[] }} */
	const parsedDescription = JSON.parse(examinationTimetableItem.description);

	if (isDeadline) {
		return {
			description: parsedDescription.preText,
			eventLineItems: parsedDescription.bulletPoints.map((bp) => ({ description: bp }))
		};
	} else {
		return {
			description: [parsedDescription.preText, ...parsedDescription.bulletPoints].join('\r\n* ')
		};
	}
}

/**
 * Returns the payload containing all the examination timetable items.
 *
 * @param {number} examinationTimetableId
 * @returns { Promise<NSIPExamTimetable | null> }
 */
async function buildExamTimetableItemsPayload(examinationTimetableId) {
	const examinationTimetable = await examinationTimetableRepository.getWithItems(
		examinationTimetableId
	);
	if (!examinationTimetable) {
		return null;
	}

	if (!examinationTimetable.case?.reference) {
		throw new Error(`'reference' was undefined for case with ID ${examinationTimetable.caseId}`);
	}

	return {
		caseReference: examinationTimetable.case.reference,
		events:
			examinationTimetable.ExaminationTimetableItem?.map(
				buildSingleExaminationTimetableItemPayload
			) ?? []
	};
}

/**
 * Returns a single examination timetable item to add to the full payload.
 *
 * @param {ExaminationTimetableItemWithType} examinationTimetableItem
 * @returns {NSIPExamTimetableItem}
 */
function buildSingleExaminationTimetableItemPayload(examinationTimetableItem) {
	const { description = '', eventLineItems = [] } =
		extractDescriptionAndLineItems(examinationTimetableItem);

	return {
		type: examinationTimetableItem.ExaminationTimetableType.name,
		date: examinationTimetableItem.date.toISOString().replace('Z', ''),
		description,
		eventTitle: examinationTimetableItem.name,
		eventDeadlineStartDate: examinationTimetableItem.startDate?.toISOString().replace('Z', ''),
		eventId: examinationTimetableItem.id,
		eventLineItems
	};
}

/**
 * Publishes an examination timetable. Does so by updating the examination timetable to be published and
 * sending the examination timetable items to the event queue to be published on the front office.
 *
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function publish(id) {
	try {
		await verifyNotTrainingExamTimetable(id);

		const examTimetablePayload = await buildExamTimetableItemsPayload(id);
		if (examTimetablePayload) {
			await eventClient.sendEvents(NSIP_EXAM_TIMETABLE, [examTimetablePayload], EventType.Publish);
		}
	} catch (/** @type {*} */ err) {
		logger.info('Blocked sending event for examination timetable', err.message);
	}

	const now = new Date();
	await examinationTimetableRepository.update(id, {
		published: true,
		publishedAt: now,
		updatedAt: now
	});
}

/**
 * Unpublishes an examination timetable. Does so by updating the examination timetable to be unpublished and
 * sending the examination timetable items to the event queue to be unpublished on the front office.
 *
 * @param { Number } id
 * @returns {Promise<void>}
 */
export async function unPublish(id) {
	try {
		await verifyNotTrainingExamTimetable(id);

		const examTimetablePayload = await buildExamTimetableItemsPayload(id);
		if (examTimetablePayload) {
			await eventClient.sendEvents(
				NSIP_EXAM_TIMETABLE,
				[examTimetablePayload],
				EventType.Unpublish
			);
		}
	} catch (/** @type {*} */ err) {
		logger.info('Blocked sending event for examination timetable', err.message);
	}

	await examinationTimetableRepository.update(id, {
		published: false
	});
}

/**
 * called after an update, to send an broadcast an update event to the service bus
 *
 * @param { Number } id	// exam timetable parent id
 * @returns {Promise<void>}
 */
export async function sendUpdateEvent(id) {
	const examTimetablePayload = await buildExamTimetableItemsPayload(id);

	if (examTimetablePayload) {
		await eventClient.sendEvents(NSIP_EXAM_TIMETABLE, [examTimetablePayload], EventType.Update);
	}
}

/**
 *
 * @param {import('@pins/applications.api').Schema.ExaminationTimetableItem} examinationTimetableItem
 * @param {Number} parentFolderId
 * @param {String} stage
 * @param {Number} caseId
 * @returns
 */
export const createDeadlineSubFolders = async (
	examinationTimetableItem,
	parentFolderId,
	stage,
	caseId
) => {
	if (!examinationTimetableItem?.description) {
		return;
	}

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
	 * @type {Promise<Folder |null>[]}
	 */
	const createFolderPromise = [];

	// create Other sub folder
	const otherFolder = {
		displayNameEn: 'Other',
		caseId,
		parentFolderId: parentFolderId,
		stage,
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
			parentFolderId,
			stage,
			displayOrder: 100
		};
		createFolderPromise.push(folderRepository.createFolder(subFolder));
	});

	logger.info('Create sub folders');
	const folders = await Promise.all(createFolderPromise);
	logger.info('Sub folders created successfully');

	const project = await caseRepository.getById(caseId, { sector: true });
	// now send broadcast event for folders creation - ignoring folders on training cases.
	try {
		await verifyNotTraining(caseId);

		await eventClient.sendEvents(
			FOLDER,
			buildFoldersPayload(folders, project.reference),
			EventType.Create
		);
	} catch (/** @type {*} */ err) {
		logger.info('Blocked sending event for folder create', err.message);
	}
};

/**
 * Deletes all the sub folders in a exam timetable folder, assumption is that all folders are empty.
 * eg for deadline exams, deletes all line item folders and the "Other" folder
 *
 * @param {Number} caseId
 * @param {Number} parentFolderId
 */
export const deleteDeadlineSubFolders = async (caseId, parentFolderId) => {
	const subFolders = await folderRepository.getByCaseId(caseId, parentFolderId);
	if (!subFolders) {
		logger.info(`No sub folder found for the parent folder Id ${parentFolderId}`);
		return;
	}

	const idsToDelete = subFolders.map((folder) => folder.id);
	await folderRepository.deleteFolderMany(idsToDelete);
	logger.info(`Sub folders deleted successfully in folder: ${parentFolderId}`);

	const project = await caseRepository.getById(caseId, { sector: true });
	// now send broadcast event for folders deletion - ignoring folders on training cases.
	try {
		await verifyNotTraining(caseId);

		await eventClient.sendEvents(
			FOLDER,
			buildFoldersPayload(subFolders, project.reference),
			EventType.Delete
		);
	} catch (/** @type {*} */ err) {
		logger.info('Blocked sending event for folder delete', err.message);
	}
};

/**
 *
 * @param {import('@prisma/client').ExaminationTimetableItem} timetableItem
 * @param {number} caseId
 * @returns {Promise<boolean>}
 */
export const validateSubmissions = async (timetableItem, caseId) => {
	const folder = await folderRepository.getById(timetableItem.folderId);
	if (!folder) {
		logger.info('No associated folder found');
		return false;
	}

	const documents = await documentRepository.countDocumentsInFolder(timetableItem.folderId);
	if (documents && documents > 0) {
		logger.info(`Document found in folder ${timetableItem.folderId}`);
		return true;
	}

	const subFolders = await folderRepository.getByCaseId(caseId, timetableItem.folderId);
	if (!subFolders || subFolders.length === 0) {
		logger.info(`No sub folder for folder ${timetableItem.folderId}`);
		return false;
	}

	const subfoldersDocuments = await Promise.all(
		subFolders.map((subFolder) => documentRepository.countDocumentsInFolder(subFolder.id))
	);

	if (subfoldersDocuments.some((sd) => sd > 0)) {
		logger.info(`Document found for parent folder ${timetableItem.folderId}`);
		return true;
	}

	logger.info(`Document not found for parent folder ${timetableItem.folderId}`);
	return false;
};
