import { repStatusMap } from '../../../utils/representation-status-map.js';

/**
 * @param {string} oldStatus
 * @param {string} newStatus
 * @returns {boolean}
 */
export const isRepresentationDepublished = (oldStatus, newStatus) =>
	oldStatus === repStatusMap.published &&
	(newStatus === repStatusMap.awaitingReview ||
		newStatus === repStatusMap.referred ||
		newStatus === repStatusMap.invalid);
