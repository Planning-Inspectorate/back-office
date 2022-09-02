import pino from '../../../lib/logger.js';
import { getApplicationDraft } from '../applications-create.service.js';

/** @typedef {import('./applications-create-check-your-answers.types').ApplicationsCreateConfirmationProps} ApplicationsCreateConfirmationProps */

/**
 * View the confirmation page for the case creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateConfirmationProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateConfirmation(req, response) {
	const { applicationId } = response.locals;
	const { reference } = await getApplicationDraft(applicationId);

	if (!reference) {
		pino.warn(`[WEB] reference number for case ${applicationId} is not defined`);
	}

	const values = { reference };

	return response.render('applications/create/confirmation', { values });
}
