/**
 * Register and validate the caseId and the repId
 *
 * @type {import('express').RequestHandler<*, *, *, *, *>}
 */
export const registerRepsParams = ({ params }, response, next) => {
	response.locals.caseId = params.caseId || '';
	response.locals.representationId = params.repId || params.representationId || '';
	next();
};
