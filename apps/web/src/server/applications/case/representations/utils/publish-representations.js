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

	if (!numberOfRepresentationsPublished)
		throw new Error('No representations in batch were published');

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

/**
 * @typedef {Object} Representation
 * @property {string} id
 * @property {string} status
 */

/**
 * @typedef {Object} Representations
 * @property {Representation[]} items
 * @property {any[]} filters
 */

/**
 * Extracts publishedRepIds (number[]) and count from an array of representations.
 * @param {Representation[] | null | undefined} items
 * @returns {{ publishedRepIds: number[], publishedRepsCount: number }}
 */
export function getPublishedRepIdsAndCount(items) {
	if (!Array.isArray(items)) return { publishedRepIds: [], publishedRepsCount: 0 };
	const publishedRepIds = items
		.filter((rep) => rep.status === 'PUBLISHED')
		.map((rep) => Number(rep.id));
	let publishedRepsCount = 0;
	try {
		publishedRepsCount = getNumberOfRepresentationsPublished({ publishedRepIds });
	} catch (e) {
		publishedRepsCount = 0;
	}
	return { publishedRepIds, publishedRepsCount };
}
