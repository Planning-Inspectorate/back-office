/**
 * Register the caseId retrieved from the URL for the resumed step of the ApplicationsCreate process.
 *
 * @type {import('express').RequestHandler<*, *, *, *, *>}
 */
export const registerCaseId = ({ params }, response, next) => {
	response.locals.caseId = params.caseId || '';
	next();
};
