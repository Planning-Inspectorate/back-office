import newReviewRepository from '../repositories/review-questionnaire.repository.js';
import { transitionState } from '../state-machine/transition-state.js';
import appealRepository from '../repositories/appeal.repository.js';
import { buildAppealCompundStatus } from '../utils/build-appeal-compound-status.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */

const reviewComplete = function (reviewReason) {
	return Object.keys(reviewReason).every((index) => !reviewReason[index])? true : false;
};

export const confirmLPAQuestionnaireService = async function(reviewReason, appealId) {
	const reviewResult = reviewComplete(reviewReason);
	const appeal = await appealRepository.getById(appealId);
	await newReviewRepository.addReview(appeal.id, reviewResult, reviewReason);
	const appealStatemachineStatus = reviewResult ?  'COMPLETE' : 'INCOMPLETE';
	const appealStatus = buildAppealCompundStatus(appeal.appealStatus);
	const nextState = transitionState('household', { appealId: appeal.id }, appealStatus, appealStatemachineStatus);
	await appealRepository.updateStatusById(appeal.id, nextState.value, appeal.appealStatus);
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
