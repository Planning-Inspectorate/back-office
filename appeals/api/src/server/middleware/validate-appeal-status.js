// @ts-check

import appealRepository from '../repositories/appeal.repository.js';
import { arrayOfStatusesContainsString } from '../utils/array-of-statuses-contains-string.js';
import { asyncHandler } from './async-handler.js';

/** @typedef {import('@pins/api').Schema.AppealStatusType} AppealStatusType */

/**
 * Create an express middleware that validates an appeal against a given status or statuses.
 *
 * @param {AppealStatusType | AppealStatusType[]} status
 * @param {{ errorMessage?: string }} options
 * @returns {import('express').RequestHandler<{ appealId: number }>}
 */
export const validateAppealStatus = (
	status,
	{ errorMessage = 'Appeal is in an invalid state' } = {}
) =>
	asyncHandler(
		/** @type {import('express').RequestHandler<{ appealId: number }>} */
		async ({ params }, response, next) => {
			const statuses = Array.isArray(status) ? status : [status];
			const appeal = await appealRepository.getById(params.appealId);

			if (!appeal) {
				response.status(404);
			} else if (!arrayOfStatusesContainsString(appeal.appealStatus, statuses)) {
				response.status(409).send({
					errors: {
						appeal: errorMessage
					}
				});
			} else {
				next();
			}
		}
	);
