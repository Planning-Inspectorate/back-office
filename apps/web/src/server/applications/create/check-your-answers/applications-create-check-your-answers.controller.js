import pino from '../../../lib/logger.js';
import { getApplicationDraft } from '../applications-create.service.js';
import * as applicationsCreateCaseService from '../case/applications-create-case.service.js';
import * as applicationsCreateCheckYourAnswersService from '../check-your-answers/applications-create-check-your-answers.service.js';

/** @typedef {import('./applications-create-check-your-answers.types').ApplicationsCreateConfirmationProps} ApplicationsCreateConfirmationProps */
/** @typedef {import('./applications-create-check-your-answers.types').ApplicationsCreateCheckYourAnswersProps} ApplicationsCreateCheckYourAnswersProps */

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

/**
 * View the check your answers page
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCheckYourAnswersProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCheckYourAnswers(req, response) {
	// const { applicationId } = response.locals;
	// temp const { values } = applicationsCreateCheckYourAnswersService.getApplicationDraft(applicationId);
	const { values } = applicationsCreateCheckYourAnswersService.getApplicationDraft();

	return response.render('applications/create/check-your-answers/_check-your-answers', { values });
}
