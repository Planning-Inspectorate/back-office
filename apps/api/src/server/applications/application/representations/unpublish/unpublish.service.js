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

	if (publishedRepresentations.length > 0) {
		await broadcastNsipRepresentationUnpublishEventBatch(
			publishedRepresentations,
			EventType.Unpublish,
			caseId
		);

		await representationsRepository.setRepresentationsAsUnpublishedBatch(
			publishedRepresentations,
			actionBy
		);
	}

	return publishedRepresentations;
};

export const getUnpublishableCaseRepresentations = async (caseId) =>
	representationsRepository.getUnpublishableRepresentations(caseId);

export const isRepresentationsPreviouslyUnpublished = async (caseId) =>
	representationsRepository.isRepresentationsPreviouslyUnpublished(caseId);
