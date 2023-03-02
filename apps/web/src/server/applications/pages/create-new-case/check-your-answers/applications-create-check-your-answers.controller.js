import pino from '../../../../lib/logger.js';
import { getCase } from '../../../common/services/case.service.js';
import { destroySessionCaseHasNeverBeenResumed } from '../../../common/services/session.service.js';
import { moveStateToPreApplication } from '../applications-create.service.js';
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
	const { currentCase, caseId } = response.locals;
	const { reference } = currentCase;

	if (!reference) {
		pino.warn(`[WEB] reference number for case ${caseId} is not defined`);
	}

	const values = { reference };

	return response.render('applications/create-new-case/confirmation', { values });
}

/**
 * View the check your answers page
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCheckYourAnswersProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCheckYourAnswers(req, response) {
	const { currentCase } = response.locals;

	destroySessionCaseHasNeverBeenResumed(req.session);

	const { values } = applicationsCreateCheckYourAnswersService.mapCaseData(currentCase);

	return response.render('applications/create-new-case/check-your-answers', { values });
}

/**
 * Update the case from a draft caseto a real case
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCheckYourAnswersProps,
 * {}, {}, {}, {}>}
 */
export async function confirmCreateCase(req, response) {
	// get the id
	const { caseId } = response.locals;
	// move the case to a pre-application state
	const { errors, id: updatedCaseId } = await moveStateToPreApplication(caseId);

	// here we replace the API error messages with our user-display versions
	let errorsUpdated;

	if (errors) {
		errorsUpdated = applicationsCreateCheckYourAnswersService.mapErrorsToDisplayErrors(errors);
	}

	// re-display page if there are any errors
	if (errors || !updatedCaseId) {
		// and re-pull the case data to re-show all the fields
		const caseData = await getCase(caseId);
		const { values } = applicationsCreateCheckYourAnswersService.mapCaseData(caseData);

		return response.render('applications/create-new-case/check-your-answers', {
			errors: errorsUpdated,
			values
		});
	}

	// on success continue to the confirmation page
	response.redirect(`/applications-service/create-new-case/${updatedCaseId}/case-created`);
}
