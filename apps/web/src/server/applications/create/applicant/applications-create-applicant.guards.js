import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';
import { getSessionApplicantInfoTypes } from './applications-create-applicant-session.service.js';

/**
 *  Make sure the domainType of the user is either case-officer or case-admin-officer.
 *  OR show 403 page
 *
 *  @type {import('express').RequestHandler<{}>}
 */
export const assertStepIsBeingProvided = ({ session, path }, res, next) => {
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
