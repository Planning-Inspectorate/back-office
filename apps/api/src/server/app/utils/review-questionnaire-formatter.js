// @ts-check

import { omit } from 'lodash-es';

/**
 * @typedef {object} ReviewQuestionnare
 * @property {number} id
 * @property {*} appeal
 * @property {number} appealId
 * @property {Date} createdAt
 * @property {boolean} complete
 */

/**
 * @typedef {Omit<ReviewQuestionnare, 'id' | 'appeal' | 'appealId' | 'createdAt'>} FormattedReviewQuestionnare
 */

/**
 * Format a `reviewQuestionnaire` sourced from the database.
 *
 * @param {ReviewQuestionnare} reviewQuestionnaire - The unformatted review questionnaire
 * @returns {FormattedReviewQuestionnare} - The formatted review questionnaire
 */
export default function formatReviewQuestionnaire(reviewQuestionnaire) {
	return omit(reviewQuestionnaire, ['id', 'appeal', 'appealId', 'createdAt']);
}
