import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';
import { getSessionApplicantInfoTypes } from './applications-create-applicant-session.service.js';

/**
 *  Make sure the step is among the applicant info types selected to be provided
 *  OR show 403 page
 *
 *  @type {import('express').RequestHandler<{}>}
 */
export const assertStepIsAllowed = ({ session, path }, res, next) => {
	const { applicationId } = res.locals;
	const applicantInfoTypes = getSessionApplicantInfoTypes(session);
	const currentStepPath = path.replace(/\//g, '');

	if (!applicantInfoTypes.includes(currentStepPath)) {
		const nextStepPath = applicationsCreateApplicantService.getAllowedDestinationPath({
			session,
			path,
			goToNextPage: true
		});

		return res.redirect(`/applications-service/create-new-case/${applicationId}/${nextStepPath}`);
	}

	next();
};
