import config from '@pins/web/environment/config.js';

/**
 * View the hompage.
 * If the user is part of multiple valid auth groups they will be shown the homepage.
 * If the user has only one group it will be redirected automatically to its dashboard based on it.
 *
 * @type {import('express').RequestHandler}
 */
export function viewHomepage(request, response) {
	const userGroups = [
		config.referencedata.groups.validationOfficerGroupId,
		config.referencedata.groups.caseOfficerGroupId,
		config.referencedata.groups.inspectorGroupId
	];
	const creds = request.session.account?.idTokenClaims?.groups ?? [];

	if (userGroups.filter((element) => creds.includes(element)).length > 1) {
		response.render('app/dashboard');
	} else {
		switch (creds[0]) {
			case config.referencedata.groups.validationOfficerGroupId:
				response.redirect('/validation');
				break;
			case config.referencedata.groups.caseOfficerGroupId:
				response.redirect('/lpa');
				break;
			case config.referencedata.groups.inspectorGroupId:
				response.redirect('/inspector');
				break;
			default:
				console.error(
					'This should never happen! User logged in successfully but the user group is valid.'
				);
				break;
		}
	}
}
