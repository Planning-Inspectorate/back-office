import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_EXAM_TIMETABLE } from '#infrastructure/topics.js';
import * as examinationTimetableRepository from '../../repositories/examination-timetable.repository.js';
import * as examinationTimetableItemsRepository from '../../repositories/examination-timetable-items.repository.js';
import { EventType } from '@pins/event-client/src/event-type';

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
 * @param {import('@prisma/client').ExaminationTimetable} examinationTimetable
 * @returns { Promise<NSIPExamTimetableItem[]> }
 */
async function buildExamTimetableItemsPayload(examinationTimetable) {
	const examinationTimetableItems =
		await examinationTimetableItemsRepository.getByExaminationTimetableId(examinationTimetable.id);

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
 * @param { String } id
 * @returns {Promise<void>}
 */
export async function publish(id) {
	const now = new Date();
	const updatedExaminationTimetable = await examinationTimetableRepository.updateByCaseId(
		+id,
		// @ts-ignore
		{
			published: true,
			publishedAt: now,
			updatedAt: now
		}
	);

	const examTimetableItemsPayload = await buildExamTimetableItemsPayload(
		updatedExaminationTimetable
	);

	await eventClient.sendEvents(NSIP_EXAM_TIMETABLE, examTimetableItemsPayload, EventType.Publish);
}
