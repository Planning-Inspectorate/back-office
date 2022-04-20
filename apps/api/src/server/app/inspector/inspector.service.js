// @ts-check

import appealRepository from '../repositories/appeal.repository.js';
import { transitionState } from '../state-machine/transition-state.js';
import { appealFormatter } from './appeal-formatter.js';
import { arrayOfStatusesContainsString } from '../utils/array-of-statuses-contains-string.js';
import { buildAppealCompundStatus } from '../utils/build-appeal-compound-status.js';

/** @typedef {import('@pins/appeals').Inspector.Appeal} Appeal */
/** @typedef {import('@pins/appeals').Inspector.AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/appeals').Inspector.SiteVisitType} SiteVisitType */

/**
 * @typedef {object} SiteVisitData
 * @property {Date} visitDate - The date of the site visit.
 * @property {string} visitSlot – The time slot of site visit.
 * @property {SiteVisitType} visitType – The type of site visit.
 */

/**
 * @typedef {object} BookSiteVisitData
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {SiteVisitData} siteVisit - The site visit data
 */

/**
 * Book a site visit for an appeal.
 *
 * @param {BookSiteVisitData} data - The site visit data.
 * @returns {Promise<Appeal>} - A promise that resolves to the updated appeal entity.
 */
export const bookSiteVisit = async ({ appealId, siteVisit }) => {
	const appeal = await appealRepository.getById(appealId);
	const appealStatus = buildAppealCompundStatus(appeal.appealStatus);
	const nextState = transitionState('household', { appealId }, appealStatus, 'BOOK', true);
	await appealRepository.updateStatusAndDataById(appealId, nextState.value, {
		siteVisit: {
			create: siteVisit
		}
	});
	return {
		id: appeal.id,
		status: nextState.value,
		userId: appeal.userId
	};
};

/**
 * @typedef {object} IssueDecisionData
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {AppealOutcome} outcome – The outcome for the appeal.
 * @property {Express.Multer.File} decisionLetter - The uploaded decision letter.
 */

/**
 * Issue a decision for an appeal on behalf of a user.
 *
 * @param {IssueDecisionData} data - The site visit data.
 * @returns {Promise<Appeal>} - A promise that resolves to the updated appeal entity.
 */
export const issueDecision = async ({ appealId, outcome, decisionLetter }) => {
	const appeal = await appealRepository.getById(appealId);
	const appealStatus = buildAppealCompundStatus(appeal.appealStatus);
	const nextState = transitionState('household', { appealId }, appealStatus, 'DECIDE', true);

	await appealRepository.updateStatusAndDataById(appealId, nextState.value, {
		inspectorDecision: {
			create: {
				appealId,
				outcome,
				// TODO: Obtain a path to file after uploading the decision letter to azure storage
				decisionLetterFilename: decisionLetter.originalname
			}
		}
	});
	return {
		id: appeal.id,
		status: nextState.value,
		userId: appeal.userId
	};
};

export const assignAppealsById = async function(userId, appealIds) {
	const successfullyAssigned = [];
	const unsuccessfullyAssigned = [];
	await Promise.all(appealIds.map(async (appealId) => {
		const appeal = await appealRepository.getById(appealId, true, false, true, true, true, true);
		if (appeal.userId == undefined && arrayOfStatusesContainsString(appeal.appealStatus, 'available_for_inspector_pickup')) {
			try {
				const appealStatus = buildAppealCompundStatus(appeal.appealStatus);
				const nextState = transitionState('household', { appealId: appeal.id }, appealStatus, 'PICKUP');
				await appealRepository.updateStatusAndDataById(appeal.id, nextState.value, { user: { connect: { id: userId } } });
				successfullyAssigned.push(appealFormatter.formatAppealForAssigningAppeals(appeal));
			} catch (error) {
				console.error(error);
				unsuccessfullyAssigned.push(appealFormatter.formatAppealForAssigningAppeals(appeal, error.message));
			}
		} else if (!arrayOfStatusesContainsString(appeal.appealStatus, 'available_for_inspector_pickup')) {
			unsuccessfullyAssigned.push(appealFormatter.formatAppealForAssigningAppeals(appeal, 'appeal in wrong state'));
		} else if (appeal.userId !== undefined) {
			unsuccessfullyAssigned.push(appealFormatter.formatAppealForAssigningAppeals(appeal, 'appeal already assigned'));
		}
	}));
	return { successfullyAssigned: successfullyAssigned, unsuccessfullyAssigned: unsuccessfullyAssigned };
};
