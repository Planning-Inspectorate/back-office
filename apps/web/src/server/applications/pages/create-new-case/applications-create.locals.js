/**
 * Register the applicationID retrieved from the URL for the resumed step of the ApplicationsCreate process.
 *
 * @type {import('express').RequestHandler<*, *, *, *, {applicationId: string}>}
 */
export const registerApplicationId = ({ params }, response, next) => {
	response.locals.applicationId = params.applicationId || '';
	next();
};
