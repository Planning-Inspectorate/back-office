/** @typedef {import('../applications.router').DomainParams} DomainParams */

/**
 * @typedef {object} ApplicationsCreateLocals
 * @property {string} applicationId
 */

/**
 * Register the applicationID retrieved from the URL for the resumed step of the ApplicationsCreate process.
 *
 * @type {import('express').RequestHandler<DomainParams, *, *, *, ApplicationsCreateLocals>}
 */
export const registerApplicationId = ({ params }, response, next) => {
	if (!params.applicationId) {
		return response.render('applications/create/_name');
	}
	response.locals.applicationId = params.applicationId;
	next();
};
