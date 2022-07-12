import { getSessionApplicantInfoTypes } from './applications-create-applicant-session.service.js';

/**
 *  Make sure the domainType of the user is either case-officer or case-admin-officer.
 *  OR show 403 page
 *
 *  @type {import('express').RequestHandler<{}>}
 */
export const assertStepIsBeingProvided = (req, res, next) => {
	const { applicationId } = res.locals;
	const applicantPages = [
		'applicant-organisation-name',
		'applicant-full-name',
		'applicant-address',
		'applicant-website',
		'applicant-email',
		'applicant-telephone-number',
		'key-dates'
	];
	const applicantInfoTypes = [
		'applicant-information-types',
		...getSessionApplicantInfoTypes(req.session)
	];

	const currentStepPath = req.path.slice(1);
	const currentStepPathIndex = applicantPages.indexOf(currentStepPath);
	const nextPathIndex =
		currentStepPathIndex > -1 ? currentStepPathIndex + 1 : applicantPages.length - 1;
	const nextStepPath = applicantPages[nextPathIndex];

	if (!applicantInfoTypes.includes(currentStepPath)) {
		return res.redirect(`/applications-service/create-new-case/${applicationId}/${nextStepPath}`);
	}

	next();
};
