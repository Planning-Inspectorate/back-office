import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';

/** @typedef {import('../../applications.router').DomainParams} DomainParams */

/**
 * Register the applicationID retrieved from the URL for the resumed step of the ApplicationsCreate process.
 *
 * @type {import('express').RequestHandler<DomainParams, *, *, *, *>}
 */
export const registerBackLink = ({ session, path }, response, next) => {
	response.locals.backLink = applicationsCreateApplicantService.getAllowedDestinationPath({
		session,
		path,
		goToNextPage: false
	});

	next();
};
