import appealRepository from '#repositories/appeal.repository.js';
import transitionState from '#state/transition-state.js';
import { broadcastAppealState } from '#endpoints/integrations/integrations.service.js';
import { STATE_TARGET_COMPLETE } from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} Appeal */
/** @typedef {import('@pins/appeals.api').Schema.InspectorDecision} Decision */
/** @typedef {import('@pins/appeals.api').Schema.InspectorDecisionOutcomeType} DecisionType */
/** @typedef {import('@pins/appeals.api').Schema.Document} Document */

/**
 *
 * @param {Appeal} appeal
 * @param {DecisionType} outcome
 * @param {Date} documentDate
 * @param {Document} document
 * @param {string} azureUserId
 * @returns
 */
export const publishDecision = async (appeal, outcome, documentDate, document, azureUserId) => {
	const result = await appealRepository.setAppealDecision(appeal.id, {
		documentDate,
		documentGuid: document.guid,
		version: document.latestDocumentVersion?.version || 1,
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

	return null;
};
