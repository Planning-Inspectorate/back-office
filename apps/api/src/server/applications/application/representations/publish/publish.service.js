import * as representationsRepository from '#repositories/representation.repository.js';
import { EventType } from '@pins/event-client';
import { setRepresentationsAsPublishedBatch } from '#repositories/representation.repository.js';
import { broadcastNsipRepresentationPublishEventBatch } from '#infrastructure/event-broadcasters.js';

/**
 * @param {number} caseId
 * @param {number[]} representationIds
 * @param {string} actionBy
 * */
export const publishCaseRepresentations = async (caseId, representationIds, actionBy) => {
	const representations = await representationsRepository.getPublishableRepresentationsById(
		caseId,
		representationIds
	);

	if (representations.length > 0) {
		await broadcastNsipRepresentationPublishEventBatch(representations, EventType.Publish, caseId);

		await setRepresentationsAsPublishedBatch(representations, actionBy);
	}

	return representations;
};
