import appealRepository from '#repositories/appeal.repository.js';
import transitionState from '#state/transition-state.js';
import { broadcastAppealState } from '#endpoints/integrations/integrations.service.js';
import { STATE_TARGET_COMPLETE, CASE_OUTCOME_INVALID } from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} Appeal */
/** @typedef {import('@pins/appeals.api').Schema.InspectorDecision} Decision */
/** @typedef {import('@pins/appeals.api').Schema.InspectorDecisionOutcomeType} DecisionType */

/**
 *
 * @param {Appeal} appeal
 * @param {string} invalidDecisionReason
 * @param {string} azureUserId
 * @returns
 */

export const publishInvalidDecision = async (appeal, invalidDecisionReason, azureUserId) => {
	const outcome = CASE_OUTCOME_INVALID;
	const result = await appealRepository.setInvalidAppealDecision(appeal.id, {
		invalidDecisionReason,
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
