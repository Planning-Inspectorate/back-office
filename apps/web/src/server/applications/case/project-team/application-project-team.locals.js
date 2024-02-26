import pino from '../../../lib/logger.js';

/**
 * Parse user id and save it in the locals
 *
 * @type {import('@pins/express').RequestHandler<{}, {userId: string}>}
 */
export const registerUserId = async (request, response, next) => {
	const parsedUserId = String(request.params.userId);

	// user id has the form: aadd12-23bdddb-cc45-dd65
	const validUserIdRegex = /^[A-Za-z0-9-]+$/;

	if (!validUserIdRegex.test(parsedUserId)) {
		pino.error('[WEB] User id not valid');
		return response.render(`app/500.njk`);
	}

	response.locals.userId = parsedUserId;

	console.log(parsedUserId);

	next();
};
