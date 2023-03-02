import pino from '../../../../lib/logger.js';
import {
	getSessionApplicantInfoTypes,
	getSessionCaseHasNeverBeenResumed
} from '../../../common/services/session.service.js';
import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';

/**
 *  Make sure the step is among the applicant info types selected to be provided
 *  OR show 403 page
 *
 *  @type {import('express').RequestHandler<{}>}
 */
export const assertStepIsAllowed = ({ session, path }, res, next) => {
	const { caseId } = res.locals;
	const applicantInfoTypes = getSessionApplicantInfoTypes(session);
	const currentStepPath = path.replace(/\//g, '');
	const hasNeverBeenResumed = getSessionCaseHasNeverBeenResumed(session);

	if (hasNeverBeenResumed && !applicantInfoTypes.includes(currentStepPath)) {
		const nextStepPath = applicationsCreateApplicantService.getAllowedDestinationPath({
			session,
			path,
			goToNextPage: true
		});

		pino.warn(`[WEB] Step ${currentStepPath} is not allowed, redirect to ${nextStepPath}`);

		return res.redirect(`/applications-service/create-new-case/${caseId}/${nextStepPath}`);
	}

	next();
};
