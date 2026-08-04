// @ts-nocheck
import {
	unpublishRepresentations,
	getUnpublishableRepresentations
} from './unpublish-representations.service.js';
import logger from '../../../../lib/logger.js';
import { unpublishRepresentationsErrorUrl } from '../config.js';
import * as authSession from '../../../../app/auth/auth-session.service.js';

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

	let publishedRepsCount = 0;
	try {
		const result = await getUnpublishableRepresentations(caseId);
		publishedRepsCount = result?.count;
	} catch (error) {
		logger.error(error);
		return res.redirect(unpublishRepresentationsErrorUrl);
	}

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

		const actionBy = authSession.getAccount(req.session)?.name || 'SYSTEM';
		const result = await unpublishRepresentations(caseId, actionBy);

		return res.redirect(
			`/applications-service/case/${caseId}/relevant-representations?unpublished=${result.count}`
		);
	} catch (error) {
		logger.error(
			`[postUnpublishRepresentationsController] Failed to unpublish representations:`,
			error
		);
		return res.redirect(unpublishRepresentationsErrorUrl);
	}
}
