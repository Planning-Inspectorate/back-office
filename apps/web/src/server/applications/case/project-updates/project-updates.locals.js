/**
 * Register the ProjectUpdateId retrieved from the URL for the project update process.
 *
 * @type {import('express').RequestHandler<*, *, *, *, {projectUpdateId: string}>}
 */
export const registerProjectUpdateId = ({ params }, response, next) => {
	response.locals.projectUpdateId = params.projectUpdateId || '';
	next();
};
