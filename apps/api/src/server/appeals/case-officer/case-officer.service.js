import appealRepository from '../repositories/appeal.repository.js';
import newReviewRepository from '../repositories/review-questionnaire.repository.js';
import { transitionState } from '../state-machine/transition-state.js';
import { breakUpCompoundStatus } from '../utils/break-up-compound-status.js';
import { buildAppealCompundStatus } from '../utils/build-appeal-compound-status.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */

const reviewComplete = (reviewReason) => {
	return Object.keys(reviewReason).every((index) => !reviewReason[index]);
};

export const confirmLPAQuestionnaireService = async (reviewReason, appealId) => {
	const reviewResult = reviewComplete(reviewReason);
	const appeal = await appealRepository.getById(appealId);

	await newReviewRepository.addReview(appeal.id, reviewResult, reviewReason);

	const appealStatemachineStatus = reviewResult ? 'COMPLETE' : 'INCOMPLETE';
	const appealStatus = buildAppealCompundStatus(appeal.appealStatus);
	const nextState = transitionState({
		appealType: appeal.appealType.type,
		context:{ appealId: appeal.id },
		status: appealStatus,
		machineAction: appealStatemachineStatus
	});
	const newState = breakUpCompoundStatus(nextState.value, appeal.id);

	await appealRepository.updateStatusById(appeal.id, newState, appeal.appealStatus);
};

/**
 * @typedef {object} UpdateAppealDetailsData
 * @property {string} listedBuildingDescription
 */

/**
 * @param {number} appealId
 * @param {UpdateAppealDetailsData} data
 * @returns {import('@prisma/client').PrismaPromise<Appeal>}
 */
export function updateAppealDetails(appealId, { listedBuildingDescription }) {
	return appealRepository.updateById(appealId, {
		lpaQuestionnaire: {
			update: {
				listedBuildingDescription
			}
		}
	});
}
