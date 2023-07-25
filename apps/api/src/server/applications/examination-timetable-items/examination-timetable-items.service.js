import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_EXAM_TIMETABLE } from '#infrastructure/topics.js';
import * as examinationTimetableRepository from '../../repositories/examination-timetable.repository.js';
import * as examinationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';
import { EventType } from '@pins/event-client';

/**
 * @typedef {import('../../../message-schemas/events/nsip-exam-timetable.js').NSIPExamTimetableItem} NSIPExamTimetableItem
 * @typedef {import('../../../message-schemas/events/nsip-exam-timetable.js').NSIPExamTimetableItemDescriptionLineItem} NSIPExamTimetableItemDescriptionLineItem
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

	return examinationTimetableItems?.map(buildSingleExaminationTimetableItemPayload);
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
	await examinationTimetableRepository.updateByCaseId(id, {
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
	await examinationTimetableRepository.updateByCaseId(id, {
		published: false
	});
}
