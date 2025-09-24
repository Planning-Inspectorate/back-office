// Service for unpublishing representations on a case
import * as representationsRepository from '#repositories/representation.repository.js';
import { EventType } from '@pins/event-client';
import { broadcastNsipRepresentationUnpublishEventBatch } from '#infrastructure/event-broadcasters.js';
import { getAllPublishedRepresentationsById } from '#repositories/representation.repository.js';

/**
 * Unpublishes representations for a given case and list of representation IDs.
 * Only representations with status 'PUBLISHED' will be processed.
 *
 * @param {number} caseId - The case ID to which the representations belong
 * @param {number[]} representationIds - Array of representation IDs to unpublish
 * @param {string} actionBy - The user performing the unpublish action
 * @returns {Promise<Array>} - The representations that were unpublished
 */
export const unpublishCaseRepresentations = async (caseId, representationIds, actionBy) => {
	// Fetch all representations matching the IDs for the case
	const publishedRepresentations = await getAllPublishedRepresentationsById(
		caseId,
		representationIds
	);

	// Only proceed if there are representations to unpublish
	if (publishedRepresentations.length > 0) {
		// Broadcast unpublish events for these representations
		await broadcastNsipRepresentationUnpublishEventBatch(
			publishedRepresentations,
			EventType.Unpublish,
			caseId
		);

		// Update the status of these representations in the database
		await representationsRepository.setRepresentationsAsUnpublishedBatch(
			publishedRepresentations,
			actionBy
		);
	}

	// Return the representations that were actually unpublished
	return publishedRepresentations;
};

/**
 * Gets all representations for a case that are eligible to be unpublished.
 * @param {number} caseId - The case ID
 * @returns {Promise<Array>} - The unpublishable representations
 */
export const getUnpublishableCaseRepresentations = async (caseId) =>
	representationsRepository.getUnpublishableRepresentations(caseId);
