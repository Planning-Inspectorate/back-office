import { representationsUrl, publishAllValidRepsUrl, publishSelectedRepsUrl } from '../config.js';
import { hasUnpublishedRepUpdates } from './has-unpublished-rep-updates.js';

/**
 *
 * @param {import('../relevant-representation.types.js').PublishableReps} publishableReps
 * @param {string} serviceUrl
 * @param {string} caseId
 * @returns {string}
 */

export const getPublishQueueUrl = (publishableReps, serviceUrl, caseId) => {
	const urlBase = `${serviceUrl}/case/${caseId}/${representationsUrl}`;
	return !hasUnpublishedRepUpdates(publishableReps)
		? `${urlBase}/${publishAllValidRepsUrl}`
		: `${urlBase}/${publishSelectedRepsUrl}`;
};
