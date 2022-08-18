import { validationResult } from 'express-validator';
import { TransitionStateError } from '../appeals/state-machine/transition-state.js';
import logger from '../utils/logger.js';

/**
 * The default catch-all error handler.
 *
 * @type {import('express').ErrorRequestHandler}
 */
export function defaultErrorHandler(error, _request, response, next) {
	if (response.headersSent) {
		return next(error);
	}

	const code = error.code ? error.code : 500;

	response.status(code);
	logger.error(error);
	response.send({ error: error.message });
}

/**
 * Handle any requests thrown by failed state transitions within the state machine.
 *
 * @type {import('express').ErrorRequestHandler}
 */
export const stateMachineErrorHandler = (error, _, response, next) => {
	if (error instanceof TransitionStateError) {
		response.status(409).send({
			errors: {
				appeal: error.message
			}
		});
	} else {
		next(error);
	}
};

/**
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 * @param {number} status
 */
const validationErrorHandlerTemplate = (request, response, next, status) => {
	const result = validationResult(request).formatWith(({ msg }) => msg);

	if (!result.isEmpty()) {
		response.status(status).send({ errors: result.mapped() });
	} else {
		next();
	}
};

/**
 * @type {import('express').RequestHandler}
 */
export const validationErrorHandler = (request, response, next) => {
	validationErrorHandlerTemplate(request, response, next, 400);
};

/**
 * @type {import('express').RequestHandler}
 */
export const validationErrorHandlerMissing = (request, response, next) => {
	validationErrorHandlerTemplate(request, response, next, 404);
};

/**
 * @type {import('express').RequestHandler}
 */
export const validationErrorHandlerUnauthorised = (request, response, next) => {
	validationErrorHandlerTemplate(request, response, next, 403);
};
