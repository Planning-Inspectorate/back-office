import * as representationsRepository from '#repositories/representation.repository.js';
import { EventType } from '@pins/event-client';
import { broadcastNsipRepresentationUnpublishEventBatch } from '#infrastructure/event-broadcasters.js';
import { getAllPublishedRepresentationsById } from '#repositories/representation.repository.js';

/**
 * @param {number} caseId
 * @param {number[]} representationIds
 * @param {string} actionBy
 * */
export const unpublishCaseRepresentations = async (caseId, representationIds, actionBy) => {
	const publishedRepresentations = await getAllPublishedRepresentationsById(
		caseId,
		representationIds
	);

	// Filter out representations that are already unpublished
	const unpublishableRepresentations = publishedRepresentations.filter(
		(rep) => rep.status === 'PUBLISHED'
	);

	if (unpublishableRepresentations.length > 0) {
		// Broadcast unpublish events using existing event broadcaster with Unpublish event type
		await broadcastNsipRepresentationUnpublishEventBatch(
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

export const getUnpublishableCaseRepresentations = async (caseId) =>
	representationsRepository.getUnpublishableRepresentations(caseId);

export const isRepresentationsPreviouslyUnpublished = async (caseId) =>
	representationsRepository.isRepresentationsPreviouslyUnpublished(caseId);
