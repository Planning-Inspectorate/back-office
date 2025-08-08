// @ts-nocheck
import { setRepresentationsAsUnpublishedBatch } from '@pins/applications.api/src/server/repositories/representation.repository.js';
import { getRepresentations, getCase } from './applications-relevant-reps.service.js';
import { getPublishedRepIdsAndCount } from './utils/publish-representations.js';

const view = 'applications/representations/unpublish-representations.njk';

/**
 * @typedef {Object} Representation
 * @property {string} id
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
/**
 * GET controller for the unpublish representations page.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

/**
 * Returns the project name from the case details.
 * @param {object} caseDetails - The case details object
 * @returns {string} The project name or empty string
 */
function getProjectName(caseDetails) {
	return caseDetails?.title || '';
}

/**
 * Returns the count of published representations.
 * @param {RepresentationsResponse} representations - The representations response object
 * @returns {number} The count of published representations
 */
function getPublishedCount(representations) {
	return getPublishedRepIdsAndCount(representations.items || []).publishedRepsCount;
}

/**
 * Renders the unpublish representations page.
 * @param {import('express').Response} res - Express response object
 * @param {string|number} caseId - The case ID
 * @param {number} publishedRepsCount - Number of published representations
 * @param {string} projectName - The project name
 * @returns {void}
 */
function renderUnpublishPage(res, caseId, publishedRepsCount, projectName) {
	return res.render(view, {
		caseId,
		publishedRepsCount,
		projectName
	});
}

/**
 * Returns the name of the user performing the action, or 'system' if not available.
 * @param {object} session - The session object
 * @returns {string} The user name or 'system'
 */
function getActionBy(session) {
	return session?.user?.name || 'system';
}

/**
 * Filters and returns the published representations from the list.
 * @param {RepresentationsResponse} representations - The representations response object
 * @param {Array<string|number>} publishedRepIds - Array of published representation IDs
 * @returns {Array<Representation>} Array of published representations
 */
function getPublishedReps(representations, publishedRepIds) {
	return (representations.items || []).filter((rep) => publishedRepIds.includes(rep.id));
}

/**
 * Redirects the response to the relevant representations page for the given case, including the number of unpublished representations in the query string.
 * @param {import('express').Response} res - Express response object
 * @param {string|number} caseId - The case ID
 * @param {number} unpublishedCount - The number of representations unpublished in the batch
 * @returns {void}
 *
 * Example: /applications-service/case/123/relevant-representations?unpublished=5
 */
export function redirectToRelevantReps(res, caseId, unpublishedCount) {
	return res.redirect(
		`/applications-service/case/${caseId}/relevant-representations?unpublished=${unpublishedCount}`
	);
}

/**
 * Renders a generic error page for unpublish failures.
 * @param {import('express').Response} res - Express response object
 * @param {Error} error - The error object
 * @returns {void}
 */
export function renderUnpublishError(res, error) {
	console.error('Failed to unpublish representations:', error);
	return res.status(500).render('error', {
		message: 'Failed to unpublish representations. Please try again later.'
	});
}

/**
 * GET controller for the unpublish representations page.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Renders the unpublish representations page
 */
export async function getUnpublishRepresentationsController(req, res) {
	const { caseId } = res.locals;
	const caseDetails = await getCase(caseId);
	const projectName = getProjectName(caseDetails);
	const representations = await getRepresentations(caseId, '');
	const publishedRepsCount = getPublishedCount(representations);
	return renderUnpublishPage(res, caseId, publishedRepsCount, projectName);
}

/**
 * POST controller for batch unpublishing representations.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function postUnpublishRepresentationsController(req, res) {
	const { session } = req;
	const { caseId } = res.locals;
	const representations = await getRepresentations(caseId, '');
	const { publishedRepIds } = getPublishedRepIdsAndCount(representations.items || []);
	const publishedReps = getPublishedReps(representations, publishedRepIds);
	if (!publishedReps.length) return redirectToRelevantReps(res, caseId);
	try {
		await setRepresentationsAsUnpublishedBatch(publishedReps, getActionBy(session));
		return redirectToRelevantReps(res, caseId, publishedReps.length);
	} catch (error) {
		return renderUnpublishError(res, error);
	}
}
