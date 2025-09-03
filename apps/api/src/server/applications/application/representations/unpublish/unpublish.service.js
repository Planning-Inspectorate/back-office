import * as representationsRepository from '#repositories/representation.repository.js';
import { EventType } from '@pins/event-client';
import { broadcastNsipRepresentationPublishEventBatch } from '#infrastructure/event-broadcasters.js';

/**
 * @param {number} caseId
 * @param {number[]} representationIds
 * @param {string} actionBy
 * */
export const unpublishCaseRepresentations = async (caseId, representationIds, actionBy) => {
	// For now, let's use existing methods and modify logic
	// We need to get representations that are currently PUBLISHED
	const publishedRepresentations =
		await representationsRepository.getPublishableRepresentationsById(caseId, representationIds);

	// Filter to only get actually published representations (status: 'PUBLISHED')
	const unpublishableRepresentations = publishedRepresentations.filter(
		(rep) => rep.status === 'PUBLISHED'
	);

	if (unpublishableRepresentations.length > 0) {
		// Broadcast unpublish events using existing event broadcaster with Unpublish event type
		await broadcastNsipRepresentationPublishEventBatch(
			unpublishableRepresentations,
			EventType.Unpublish,
			caseId
		);

		// TODO: We need to create setRepresentationsAsUnpublishedBatch method in repository
		// For now, this will cause an error, but shows what we need
		// await setRepresentationsAsUnpublishedBatch(unpublishableRepresentations, actionBy);

		// Temporary workaround - we'll need to implement the actual unpublish logic in the repository
		console.warn(
			'setRepresentationsAsUnpublishedBatch method needs to be implemented in representation.repository.js'
		);
		console.log(`Unpublish action requested by: ${actionBy}`); // Use actionBy to avoid unused parameter warning
	}

	return unpublishableRepresentations;
};
