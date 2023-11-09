import appealRepository from '#repositories/appeal.repository.js';
import transitionState from '#state/transition-state.js';
import { getDocumentById } from '#repositories/document.repository.js';
import { broadcastAppealState } from '#endpoints/integrations/integrations.service.js';
import { STATE_TARGET_COMPLETE } from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} Appeal */
/** @typedef {import('@pins/appeals.api').Schema.InspectorDecision} Decision */
/** @typedef {import('@pins/appeals.api').Schema.InspectorDecisionOutcomeType} DecisionType */

/**
 *
 * @param {Appeal} appeal
 * @param {DecisionType} outcome
 * @param {Date} documentDate
 * @param {string} documentGuid
 * @param {string} azureUserId
 * @returns
 */
export const publishDecision = async (appeal, outcome, documentDate, documentGuid, azureUserId) => {
	const doc = await getDocumentById(documentGuid);
	if (doc) {
		const result = await appealRepository.setAppealDecision(appeal.id, {
			documentDate,
			documentGuid,
			version: doc.latestDocumentVersion?.version || 1,
			outcome
		});

		if (result) {
			await transitionState(
				appeal.id,
				appeal.appealType,
				azureUserId,
				appeal.appealStatus,
				STATE_TARGET_COMPLETE
			);
			await broadcastAppealState(appeal.id);

			return result;
		}
	}

	return null;
};
