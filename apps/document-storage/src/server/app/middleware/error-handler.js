import pino from '../lib/logger.js';

/**
 *
 *  @type {import('express').ErrorRequestHandler}
 */
export function errorHandler(error, _request, response, next) {
	if (response.headersSent) {
		return next(error);
	}

	// const code = error.code ? parseInt(error.code) : 500;

	response.status(500);
	pino.error(error);
	return response.send({ errors: 'Oops! Something went wrong' });
}
