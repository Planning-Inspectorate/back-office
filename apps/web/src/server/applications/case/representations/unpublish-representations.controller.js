import { getRepresentations } from './applications-relevant-reps.service.js';

const view = 'applications/representations/unpublish-representations.njk';

/**
 * @typedef {Object} Representation
 * @property {string} status
 */

/**
 * @typedef {Object} RepresentationsResponse
 * @property {Representation[]} [items]
 */

/**
 * Controller for the unpublish representations page.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function unpublishRepresentationsController({ query, session }, res) {
	const { caseId } = res.locals;
	/** @type {RepresentationsResponse} */
	const representations = await getRepresentations(caseId, '');
	const publishedRepsCount = Array.isArray(representations.items)
		? representations.items.filter(
				/** @param {Representation} rep */
				(rep) => rep.status === 'PUBLISHED'
		  ).length
		: 0;

	console.log({ query, session });

	return res.render(view, {
		caseId,
		publishedRepsCount
	});
}
