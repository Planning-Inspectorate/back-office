import config from '@pins/web/environment/config.js';
import pino from '../lib/logger.js';

/**
 * View the hompage.
 * If the user is part of multiple valid auth groups they will be shown the homepage.
 * If the user has only one group it will be redirected automatically to its dashboard based on it.
 *
 * @type {import('express').RequestHandler}
 */
export function viewHomepage(request, response, next) {
	const userGroups = [
		config.auth.validationOfficerGroupID,
		config.auth.caseOfficerGroupID,
		config.auth.inspectorGroupID
	];
	const creds = request.session.account?.idTokenClaims?.groups ?? [];

	if (userGroups.filter((element) => creds.includes(element)).length > 1) {
		response.render('app/dashboard');
	} else {
		switch (creds[0]) {
			case config.auth.validationOfficerGroupID:
				response.redirect('/validation');
				break;
			case config.auth.caseOfficerGroupID:
				response.redirect('/lpa');
				break;
			case config.auth.inspectorGroupID:
				response.redirect('/inspector');
				break;
			default: {
				const error = new Error('User logged in successfully but the user group is valid.');

				pino.error(error);
				next(error);
			}
		}
	}
}
