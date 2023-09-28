import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_EXAM_TIMETABLE } from '#infrastructure/topics.js';
import * as examinationTimetableRepository from '../../repositories/examination-timetable.repository.js';
import * as examinationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';
import * as examinationTimetableTypesRepository from '../../repositories/examination-timetable-types.repository.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import logger from '../../utils/logger.js';
import { EventType } from '@pins/event-client';

/**
 * @typedef {import('../../../message-schemas/events/nsip-exam-timetable.js').NSIPExamTimetableItem} NSIPExamTimetableItem
 * @typedef {import('../../../message-schemas/events/nsip-exam-timetable.js').NSIPExamTimetableItemDescriptionLineItem} NSIPExamTimetableItemDescriptionLineItem
 * @typedef {import('@pins/applications.api').Schema.Folder} Folder
 */

/**
 * Grabs the description from the examinationTimetableItem and parses it into a description string and
 * NSIPExamTimetableItemDescriptionLineItem array.
 *
 * @param {import('@prisma/client').ExaminationTimetableItem} examinationTimetableItem
 * @returns { { description: string, eventLineItems: NSIPExamTimetableItemDescriptionLineItem[] } }
 */
function extractDescriptionAndLineItems(examinationTimetableItem) {
	if (!examinationTimetableItem.description) {
		return {
			description: '',
			eventLineItems: []
		};
	}

	const parsedDescription = JSON.parse(examinationTimetableItem.description);

	// The event line items are the bullet points that are added to the description. They are different from ExaminationTimetableItems.
	const eventLineItems = parsedDescription.bulletPoints.map((/** @type {string} */ bulletPoint) => {
		return {
			eventLineItemDescription: bulletPoint
		};
	});

	return {
		description: parsedDescription.preText,
		eventLineItems
	};
}

/**
 * Returns the payload containing all the examination timetable items.
 *
 * @param {number} examinationTimetableId
 * @returns { Promise<NSIPExamTimetableItem[]> }
 */
async function buildExamTimetableItemsPayload(examinationTimetableId) {
	const examinationTimetableItems =
		await examinationTimetableItemsRepository.getByExaminationTimetableId(examinationTimetableId);

	if (!examinationTimetableItems) {
		return [];
	}

	return examinationTimetableItems?.map(buildSingleExaminationTimetableItemPayload) ?? [];
}

/**
 * Returns a single examination timetable item to add to the full payload.
 *
 * @param {import('@prisma/client').ExaminationTimetableItem} examinationTimetableItem
 * @returns NSIPExamTimetableItem
 */
function buildSingleExaminationTimetableItemPayload(examinationTimetableItem) {
	const { description, eventLineItems } = extractDescriptionAndLineItems(examinationTimetableItem);

	return {
		// @ts-ignore
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
 * @param { Number } id
 * @returns {Promise<void>}
 */
export async function publish(id) {
	const examTimetableItemsPayload = await buildExamTimetableItemsPayload(id);
	await eventClient.sendEvents(NSIP_EXAM_TIMETABLE, examTimetableItemsPayload, EventType.Publish);

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
	const examTimetableItemsPayload = await buildExamTimetableItemsPayload(id);
	await eventClient.sendEvents(NSIP_EXAM_TIMETABLE, examTimetableItemsPayload, EventType.Unpublish);
	await examinationTimetableRepository.update(id, {
		published: false
	});
}

/**
 *
 * @param {import('@pins/applications.api').Schema.ExaminationTimetableItem} examinationTimetableItem
 * @param {Number} parentFolderId
 * @param {Number} caseId
 * @returns
 */
export const createDeadlineSubFolders = async (
	examinationTimetableItem,
	parentFolderId,
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
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.BatchPayload>}
 */
export const deleteDeadlineSubFolders = async (caseId, parentFolderId) => {
	const subFolders = await folderRepository.getByCaseId(caseId, parentFolderId);
	if (!subFolders) {
		logger.info(`No sub folder found for the parent folder Id ${parentFolderId}`);
		return;
	}

	const idsToDelete = subFolders.map(folder => folder.id);
	await folderRepository.deleteFolderMany(idsToDelete);
	logger.info(`Sub folders deleted successfully in folder: ${parentFolderId}`);
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
