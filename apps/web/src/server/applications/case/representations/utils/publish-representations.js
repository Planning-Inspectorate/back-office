import * as authSession from '../../../../app/auth/auth-session.service.js';
import { representationsUrl } from '../config.js';

/**
 * @typedef {import('../relevant-representation.types.js').PublishedReps} PublishedReps
 */

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
 * @param {Array<number>} representationIds
 * @returns {boolean}
 */
export const isAllRepresentationsPublished = ({ publishedRepIds }, representationIds) => {
	if (!publishedRepIds.length) throw new Error('No representations were published');

	return publishedRepIds.length === representationIds.length;
};

/**
 * @param {string} serviceUrl
 * @param {string} caseId
 * @param {boolean} isAllRepresentationsPublished
 * @returns {string}
 */
export const getPublishedRepresentationsRedirectURL = (
	serviceUrl,
	caseId,
	isAllRepresentationsPublished
) =>
	`${serviceUrl}/case/${caseId}/${representationsUrl}?all-representations-published=${isAllRepresentationsPublished}`;
