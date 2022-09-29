import { url } from '../../../../lib/nunjucks-filters/index.js';

/**
 * Register the backpath for edit pages.
 *
 * @type {import('express').RequestHandler<*, *, *, *, {applicationId: number, backPath: string}>}
 */
export const registerBackPath = (request, response, next) => {
	const { applicationId } = response.locals;

	response.locals.backPath = url('view-application', { applicationId });

	next();
};
