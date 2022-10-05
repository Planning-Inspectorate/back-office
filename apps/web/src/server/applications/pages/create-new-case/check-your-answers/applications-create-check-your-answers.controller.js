import pino from '../../../../lib/logger.js';
import { getApplicationDraft, moveStateToPreApplication } from '../applications-create.service.js';
import { destroySessionCaseHasNeverBeenResumed } from '../case/applications-create-case-session.service.js';
import * as applicationsCreateCheckYourAnswersService from './applications-create-check-your-answers.service.js';

/** @typedef {import('./applications-create-check-your-answers.types.js').ApplicationsCreateConfirmationProps} ApplicationsCreateConfirmationProps */
/** @typedef {import('./applications-create-check-your-answers.types.js').ApplicationsCreateCheckYourAnswersProps} ApplicationsCreateCheckYourAnswersProps */

/**
 * View the confirmation page for the case creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateConfirmationProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateConfirmation(req, response) {
	const { applicationId } = response.locals;
	const { reference } = await getApplicationDraft(applicationId, ['reference']);

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
	const { applicationId } = response.locals;

	destroySessionCaseHasNeverBeenResumed(req.session);

	const caseData = await getApplicationDraft(applicationId);

	const { values } = applicationsCreateCheckYourAnswersService.mapCaseData(caseData);

	return response.render('applications/create/check-your-answers', { values });
}

/**
 * Update the case from a draft application to a real case
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCheckYourAnswersProps,
 * {}, {}, {}, {}>}
 */
export async function confirmCreateCase(req, response) {
	// get the id
	const { applicationId } = response.locals;

	// move the case to a pre-application state
	const { errors, id: updatedApplicationId } = await moveStateToPreApplication(applicationId);

	// here we replace the API error messages with our user-display versions
	let errorsUpdated;

	if (errors) {
		errorsUpdated = applicationsCreateCheckYourAnswersService.mapErrorsToDisplayErrors(errors);
	}

	// re-display page if there are any errors
	if (errors || !updatedApplicationId) {
		// and re-pull the case data to re-show all the fields
		const caseData = await getApplicationDraft(applicationId);
		const { values } = applicationsCreateCheckYourAnswersService.mapCaseData(caseData);

		return response.render('applications/create/check-your-answers', {
			errors: errorsUpdated,
			values
		});
	}

	// on success continue to the confirmation page
	response.redirect(`/applications-service/create-new-case/${applicationId}/case-created`);
}
