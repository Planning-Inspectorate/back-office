import pino from '../../../../lib/logger.js';
import { getCase } from '../../../lib/services/case.service.js';
import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';

/**
 * Register the first allowed previous path.
 *
 * @type {import('express').RequestHandler<*, *, *, *, *>}
 */
export const registerBackPath = ({ session, path }, response, next) => {
	response.locals.backPath =
		applicationsCreateApplicantService.getAllowedDestinationPath({
			session,
			path,
			goToNextPage: false
		}) || 'team-email';

	next();
};

/**
 * Register the applicant Id.
 *
 * @type {import('express').RequestHandler<*, *, *, *, *>}
 */
export const registerApplicantId = async (req, response, next) => {
	const { applicationId } = response.locals;

	if (applicationId) {
		const applicationDraft = await getCase(applicationId, ['applicants']);
		const applicantId = applicationDraft.applicants?.[0]?.id;

		if (!applicantId) {
			return next({ statusCode: 400, message: 'Applicant id is not defined' });
		}

		response.locals.applicantId = applicantId;
	} else {
		pino.warn('[WEB] Application id is not yet defined. Cannot retrieve applicant');
	}

	next();
};
