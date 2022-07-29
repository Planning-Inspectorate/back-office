import appealRepository from '../../repositories/appeal.repository.js';
import newReviewRepository from '../../repositories/review-questionnaire.repository.js';
import { breakUpCompoundStatus } from '../../utils/break-up-compound-status.js';
import { buildAppealCompundStatus } from '../../utils/build-appeal-compound-status.js';
import { transitionState } from '../../utils/transition-state.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */

/**
 *
 * @param {object} reviewReason
 * @returns {any}
 */
const reviewComplete = (reviewReason) => {
	return Object.keys(reviewReason).every((index) => !reviewReason[index]);
};

/**
 *
 * @param {object} reviewReason
 * @param {number} appealId
 * @returns {Promise<void>}
 */
export const confirmLPAQuestionnaireService = async (reviewReason, appealId) => {
	const reviewResult = reviewComplete(reviewReason);
	const appeal = await appealRepository.getById(appealId);

	await newReviewRepository.addReview(appeal.id, reviewResult, reviewReason);

	const appealStatemachineStatus = reviewResult ? 'COMPLETE' : 'INCOMPLETE';
	const appealStatus = buildAppealCompundStatus(appeal.appealStatus);
	const nextStatus = transitionState({
		caseType: appeal.appealType.type,
		context: { appealId: appeal.id },
		status: appealStatus,
		machineAction: appealStatemachineStatus
	});
	const newState = breakUpCompoundStatus(nextStatus.value, appeal.id);

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
