import * as representationsRepository from '#repositories/representation.repository.js';
import { EventType } from '@pins/event-client';
import { broadcastNsipRepresentationPublishEventBatch } from '#infrastructure/event-broadcasters.js';

/**
 * @param {number} caseId
 * @param {number[]} representationIds
 * @param {string} actionBy
 * */
export const unpublishCaseRepresentations = async (caseId, representationIds, actionBy) => {
	const publishedRepresentations =
		await representationsRepository.getPublishableRepresentationsById(caseId, representationIds);
	console.error('>>>> publishedRepresentations ', { publishedRepresentations });
	// Filter to only get actually published representations (status: 'PUBLISHED')
	const unpublishableRepresentations = publishedRepresentations.filter(
		(rep) => rep.status === 'PUBLISHED'
	);
	console.error('>>>> unpublishableRepresentations ', { unpublishableRepresentations });
	if (unpublishableRepresentations.length > 0) {
		// Broadcast unpublish events using existing event broadcaster with Unpublish event type
		await broadcastNsipRepresentationPublishEventBatch(
			unpublishableRepresentations,
			EventType.Unpublish,
			caseId
		);

		// Use new repository batch function to update status to UNPUBLISHED and create action records
		await representationsRepository.setRepresentationsAsUnpublishedBatch(
			unpublishableRepresentations,
			actionBy
		);
	}

	return unpublishableRepresentations;
};
