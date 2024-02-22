import pino from '../../../lib/logger.js';

/**
 * Parse user id and save it in the locals
 *
 * @type {import('@pins/express').RequestHandler<{}, {userId: string}>}
 */
export const registerUserId = async (request, response, next) => {
	const parsedUserId = String(request.params.userId);

	const validUserIdRegex = /^[a-zA-Z0-9\\s\\-]{1,50}{\/}$/;

	if (!validUserIdRegex.test(parsedUserId)) {
		pino.error('[WEB] User id not valid');
		return response.render(`app/500.njk`);
	}

	response.locals.userId = parsedUserId;

	console.log(parsedUserId);

	next();
};
