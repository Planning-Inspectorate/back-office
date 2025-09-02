// @ts-nocheck
import { getRepresentations } from '../applications-relevant-reps.service.js';
import { getPublishedRepIdsAndCount } from '../utils/publish-representations.js';
import { unpublishRepresentationsBatch } from './unpublish-representations.service.js';

const view = 'applications/representations/unpublish-representations.njk';

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
 * GET controller for the unpublish representations page.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Renders the unpublish representations page
 */
export async function getUnpublishRepresentationsController(req, res) {
	try {
		const { caseId, case: caseDetails } = res.locals;
		if (!caseDetails) {
			throw new Error('Case details not found');
		}
		const projectName = caseDetails.title || '';
		const representations = await getRepresentations(caseId, '');
		if (!representations || !representations.items) {
			throw new Error('Representations not found');
		}
		const publishedRepsCount = getPublishedRepIdsAndCount(
			representations.items || []
		).publishedRepsCount;
		return res.render(view, {
			caseId,
			publishedRepsCount,
			projectName
		});
	} catch (err) {
		console.error('Error loading unpublish representations page:', err);
		return res.status(500).render('error', {
			message: 'Failed to load representations. Please try again later.'
		});
	}
}

/**
 * POST controller for batch unpublishing representations.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export async function postUnpublishRepresentationsController(req, res) {
	try {
		const { caseId } = res.locals;
		const representations = await getRepresentations(caseId, '');
		const { publishedRepIds } = getPublishedRepIdsAndCount(representations.items || []);
		if (!publishedRepIds.length) {
			return res.redirect(`/applications-service/case/${caseId}/relevant-representations`);
		}
		await unpublishRepresentationsBatch(caseId, publishedRepIds);
		return res.redirect(
			`/applications-service/case/${caseId}/relevant-representations?unpublished=${publishedRepIds.length}`
		);
	} catch (error) {
		console.error(`Error unpublishing representations: ${error}`);
		return res.status(500).render('error', {
			message: 'Failed to unpublish representations. Please try again later.'
		});
	}
}
