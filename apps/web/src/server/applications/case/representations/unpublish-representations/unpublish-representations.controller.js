// @ts-nocheck
import {
	unpublishRepresentationsBatch,
	getUnpublishableRepresentations
} from './unpublish-representations.service.js';
import logger from '../../../../lib/logger.js';
import { unpublishRepresentationsErrorUrl } from '../config.js';

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
	const { caseId, case: caseDetails } = res.locals;

	if (!caseDetails) {
		logger.error('[getUnpublishRepresentationsController] Case details not found');
		return res.redirect(unpublishRepresentationsErrorUrl);
	}

	const projectName = caseDetails.title || '';

	let representations;
	try {
		representations = await getUnpublishableRepresentations(caseId);
	} catch (error) {
		logger.error('[getUnpublishRepresentationsController] Error fetching representations:', error);
		return res.redirect(unpublishRepresentationsErrorUrl);
	}

	if (!representations || !representations.items) {
		logger.error('[getUnpublishRepresentationsController] Representations not found');
		return res.redirect(unpublishRepresentationsErrorUrl);
	}

	const publishedRepsCount = representations.itemCount || representations.items.length;

	return res.render(view, {
		caseId,
		publishedRepsCount,
		projectName
	});
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
		const representations = await getUnpublishableRepresentations(caseId);
		const publishedRepIds = representations.items?.map((item) => item.id) || [];

		if (!publishedRepIds.length) {
			return res.redirect(`/applications-service/case/${caseId}/relevant-representations`);
		}

		const actionBy = req.user?.name || res.locals.user?.name || 'SYSTEM';

		const result = await unpublishRepresentationsBatch(caseId, publishedRepIds, actionBy);
		logger.info('[postUnpublishRepresentationsController] result:', result);

		return res.redirect(
			`/applications-service/case/${caseId}/relevant-representations?unpublished=${publishedRepIds.length}`
		);
	} catch (error) {
		logger.error(
			`[postUnpublishRepresentationsController] Failed to unpublish representations:`,
			error
		);
		return res.redirect(unpublishRepresentationsErrorUrl);
	}
}
