// @ts-check

import appealRepository from '../repositories/appeal.repository.js';
import transitionState from '../state-machine/household-appeal.machine.js';

/** @typedef {import('@pins/inspector').Appeal} Appeal */
/** @typedef {import('@pins/inspector').AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/inspector').SiteVisitType} SiteVisitType */

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
	const nextState = transitionState({ appealId }, appeal.status, 'BOOK', true);

	return appealRepository.updateById(appealId, {
		status: nextState.value,
		siteVisit: {
			create: siteVisit
		}
	});
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
	const nextState = transitionState({ appealId }, appeal.status, 'DECIDE', true);

	return appealRepository.updateById(appealId, {
		status: nextState.value,
		inspectorDecision: {
			create: {
				appealId,
				outcome,
				// TODO: Obtain a path to file after uploading the decision letter to azure storage
				decisionLetterFilename: decisionLetter.originalname
			}
		}
	});
};
