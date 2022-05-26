import { validationResult } from 'express-validator';
import pino from 'pino';
import { TransitionStateError } from '../state-machine/transition-state.js';

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
	pino.error(error);
	return response.send({ error: error.message });
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
 * Evaluate any errors collected by express validation and return a 400 status
 * with the mapped errors.
 *
 * @type {import('express').RequestHandler}
 */
export const validationErrorHandler = (request, response, next) => {
	const result = validationResult(request).formatWith(({ msg }) => msg);

	if (!result.isEmpty()) {
		response.status(400).send({ errors: result.mapped() });
	} else {
		next();
	}
};
