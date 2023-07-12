import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_EXAM_TIMETABLE } from '#infrastructure/topics.js';
import * as examinationTimetableRepository from '../../repositories/examination-timetable.repository.js';
import { EventType } from '@pins/event-client';

// @todo implement
function buildPublishPayload() {
	return {};
}

/**
 * Publishes an examination timetable.
 *
 * @param { String } id
 * @returns {Promise<void>}
 */
export async function publish(id) {
	const now = new Date();
	await examinationTimetableRepository.updateByCaseId(
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
		[buildPublishPayload()],
		EventType.Create
	);
}
