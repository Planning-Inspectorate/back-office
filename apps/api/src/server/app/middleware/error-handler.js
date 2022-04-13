import { TransitionStateError } from '../state-machine/household-appeal.machine.js';

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
	console.error(error);
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
		next();
	}
};
