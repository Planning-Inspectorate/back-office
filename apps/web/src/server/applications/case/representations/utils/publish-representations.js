import * as authSession from '../../../../app/auth/auth-session.service.js';
import { representationsUrl } from '../config.js';

/**
 * @typedef {import('../relevant-representation.types.js').PublishedReps} PublishedReps
 */

export const publishRepresentationsQueryKey = 'published';

/**
 * @param {*} session
 * @param {number[]} representationIds
 * @returns {{json:  {representationIds: number[], actionBy: string | undefined}}}
 */
export const getPublishRepresentationsPayload = (session, representationIds) => {
	return {
		json: {
			representationIds,
			actionBy: authSession.getAccount(session)?.name
		}
	};
};

/**
 * @param {PublishedReps} publishedReps
 * @returns {number}
 */
export const getNumberOfRepresentationsPublished = ({ publishedRepIds }) => {
	const numberOfRepresentationsPublished = publishedRepIds.length;

	if (!numberOfRepresentationsPublished) throw new Error('No representations were published');

	return numberOfRepresentationsPublished;
};

/**
 * @param {string} serviceUrl
 * @param {string} caseId
 * @param {number} numberOfRepresentationPublished
 * @returns {string}
 */
export const getPublishedRepresentationsRedirectURL = (
	serviceUrl,
	caseId,
	numberOfRepresentationPublished
) =>
	`${serviceUrl}/case/${caseId}/${representationsUrl}?${publishRepresentationsQueryKey}=${numberOfRepresentationPublished}`;
