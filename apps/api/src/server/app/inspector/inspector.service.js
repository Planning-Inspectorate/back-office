// @ts-check
import logger from '../../app/lib/logger.js';
import appealRepository from '../repositories/appeal.repository.js';
import { appealStates, transitionState } from '../state-machine/transition-state.js';
import { arrayOfStatusesContainsString } from '../utils/array-of-statuses-contains-string.js';
import { breakUpCompoundStatus } from '../utils/break-up-compound-status.js';
import { buildAppealCompundStatus } from '../utils/build-appeal-compound-status.js';
import { appealFormatter } from './appeal-formatter.js';

/** @typedef {import('@pins/express').MulterFile} MulterFile */
/** @typedef {import('@pins/api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/api').Schema.InspectorDecisionOutcomeType} InspectorDecisionOutcomeType */
/** @typedef {import('@pins/api').Schema.SiteVisitType} SiteVisitType */

/**
 * @typedef {object} SiteVisitData
 * @property {Date} visitDate
 * @property {string} visitSlot
 * @property {SiteVisitType} visitType
 */

/**
 * @typedef {object} BookSiteVisitData
 * @property {number} appealId
 * @property {SiteVisitData} siteVisit
 */

/**
 * Book a site visit for an appeal.
 *
 * @param {BookSiteVisitData} data
 * @returns {Promise<void>}
 */
export const bookSiteVisit = async ({ appealId, siteVisit }) => {
	const appeal = await appealRepository.getById(appealId);
	const appealStatus = buildAppealCompundStatus(appeal.appealStatus);
	const nextState = transitionState({
		appealType: appeal.appealType.type,
		context: { appealId: appeal.id },
		status: appealStatus,
		machineAction: 'BOOK'
		// true
	});
	const newState = breakUpCompoundStatus(nextState.value, appeal.id);

	await appealRepository.updateStatusAndDataById(
		appealId,
		newState,
		{
			siteVisit: {
				create: siteVisit
			}
		},
		appeal.appealStatus
	);
};

/**
 * @typedef {object} IssueDecisionData
 * @property {number} appealId
 * @property {InspectorDecisionOutcomeType} outcome
 */

/**
 * Issue a decision for an appeal on behalf of a user.
 *
 * @param {IssueDecisionData} data
 * @returns {Promise<void>}
 */
export const issueDecision = async ({ appealId, outcome, decisionLetter }) => {
	const appeal = await appealRepository.getById(appealId);
	const appealStatus = buildAppealCompundStatus(appeal.appealStatus);

	const nextState = transitionState({
		appealType: appeal.appealType.type,
		context: { appealId: appeal.id },
		status: appealStatus,
		machineAction: 'DECIDE',
		throwError: true
	});
	const newState = breakUpCompoundStatus(nextState.value, appeal.id);

	await appealRepository.updateStatusAndDataById(appealId, newState, {
		inspectorDecision: {
			create: {
				// TODO: Obtain a path to file after uploading the decision letter to azure storage
				decisionLetterFilename: decisionLetter.originalname,
				outcome
			}
		}
	});
};

export const assignAppealsById = async (userId, appealIds) => {
	const successfullyAssigned = [];
	const unsuccessfullyAssigned = [];

	await Promise.all(
		appealIds.map(async (appealId) => {
			const appeal = await appealRepository.getById(appealId, {
				appellant: true,
				address: true,
				latestLPAReviewQuestionnaire: true,
				appealDetailsFromAppellant: true,
				lpaQuestionnaire: true
			});

			if (
				typeof appeal.userId === 'undefined' &&
				arrayOfStatusesContainsString(appeal.appealStatus, [
					appealStates.available_for_inspector_pickup
				])
			) {
				try {
					const appealStatus = buildAppealCompundStatus(appeal.appealStatus);
					const nextState = transitionState({
						appealType: appeal.appealType.type,
						context: { appealId: appeal.id },
						status: appealStatus,
						machineAction: 'PICKUP'
					});
					const newState = breakUpCompoundStatus(nextState.value, appeal.id);

					await appealRepository.updateStatusAndDataById(
						appeal.id,
						newState,
						{ user: { connect: { azureReference: userId } } },
						appeal.appealStatus
					);
					successfullyAssigned.push(appealFormatter.formatAppealForAssigningAppeals(appeal));
				} catch (error) {
					logger.error(error);
					unsuccessfullyAssigned.push(
						appealFormatter.formatAppealForAssigningAppeals(appeal, error.message)
					);
				}
			} else if (
				!arrayOfStatusesContainsString(appeal.appealStatus, [
					appealStates.available_for_inspector_pickup
				])
			) {
				unsuccessfullyAssigned.push(
					appealFormatter.formatAppealForAssigningAppeals(appeal, 'appeal in wrong state')
				);
			} else if (typeof appeal.userId !== 'undefined') {
				unsuccessfullyAssigned.push(
					appealFormatter.formatAppealForAssigningAppeals(appeal, 'appeal already assigned')
				);
			}
		})
	);
	return { successfullyAssigned, unsuccessfullyAssigned };
};
