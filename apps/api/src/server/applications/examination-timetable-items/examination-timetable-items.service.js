import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_EXAM_TIMETABLE } from '#infrastructure/topics.js';
import * as examinationTimetableRepository from '../../repositories/examination-timetable.repository.js';
import { EventType } from '@pins/event-client';

/**
 * @typedef {import('../../../message-schemas/events/nsip-exam-timetable.js').NSIPExamTimetable} NSIPExamTimetable
 */

/**
 * @param {import('@prisma/client').ExaminationTimetableItem} examinationTimetableItem
 * @returns { NSIPExamTimetable }
 */
function buildPublishPayload(examinationTimetableItem) {
	return {
		date: examinationTimetableItem.date,
		description: examinationTimetableItem.description,
		eventTitle: examinationTimetableItem.name,
		type: examinationTimetableItem.examinationTypeId

	}
}

/**
 * Publishes an examination timetable.
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

	await eventClient.sendEvents(
		NSIP_EXAM_TIMETABLE,
		examinationTimetableItems,
		EventType.Create
	);
}
