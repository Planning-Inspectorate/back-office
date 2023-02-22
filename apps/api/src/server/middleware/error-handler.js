import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import { TransitionStateError } from '../utils/transition-state.js';

/**
 * The default catch-all error handler.
 *
 * @type {import('express').ErrorRequestHandler}
 * @param {import('express').Request} _request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
export function defaultErrorHandler(error, _request, response, next) {
	if (response.headersSent) {
		return next(error);
	}

	const code = error.code && Number.isInteger(error.code) ? error.code : 500;

	response.status(code);
	logger.error(error);

	let errorMessage = error.message;

	try {
		errorMessage = JSON.parse(error.message);
	} catch {
		logger.debug('Error Message not JSON parsable');
	}

	response.send({ errors: errorMessage });
}

/**
 *
 * @param {string} url
 * @returns {string}
 */
const getCaseTypeFromUrl = (url) => {
	return url.split('/')[1].slice(0, -1);
};

/**
 * Handle any requests thrown by failed state transitions within the state machine.
 *
 * @type {import('express').ErrorRequestHandler}
 */
export const stateMachineErrorHandler = (error, request, response, next) => {
	if (error instanceof TransitionStateError) {
		const caseType = getCaseTypeFromUrl(request.originalUrl);
		/** @type {Object<string, string>} */ const errorMessage = {};

		errorMessage[caseType] = error.message;
		response.status(409).send({
			errors: errorMessage
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
export const validationErrorHandlerMissing = (request, response, next) => {
	validationErrorHandlerTemplate(request, response, next, 404);
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
export const validationErrorHandlerUnauthorised = (request, response, next) => {
	validationErrorHandlerTemplate(request, response, next, 403);
};
