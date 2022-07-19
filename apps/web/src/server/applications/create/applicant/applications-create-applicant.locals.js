import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';

/** @typedef {import('../../applications.router').DomainParams} DomainParams */

/**
 * Register the first allowed previous path.
 *
 * @type {import('express').RequestHandler<DomainParams, *, *, *, *>}
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
