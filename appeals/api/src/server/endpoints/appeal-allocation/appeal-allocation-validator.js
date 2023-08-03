import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import validateIdParameter from '#common/validators/id-parameter.js';
import { validationErrorHandler } from '#middleware/error-handler.js';
import { intersection } from 'lodash-es';
import {
	ERROR_APPEAL_ALLOCATION_LEVELS,
	ERROR_APPEAL_ALLOCATION_SPECIALISMS,
	ERROR_NOT_FOUND
} from '#endpoints/constants.js';
import commonRepository from '#repositories/common.repository.js';
import config from '../../config/config.js';

export const getAllocationValidator = composeMiddleware(
	validateIdParameter('appealId'),
	body('specialisms').isArray().withMessage(ERROR_APPEAL_ALLOCATION_SPECIALISMS),
	body('level')
		.isString()
		.isIn(config.appealAllocationLevels.map((/** @type {{ level: string; }} */ i) => i.level))
		.withMessage(ERROR_APPEAL_ALLOCATION_LEVELS),
	validationErrorHandler
);

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateSpecialism = async (req, res, next) => {
	const { specialisms } = req.body;
	if (specialisms && specialisms.length > 0) {
		const values = (await commonRepository.getLookupList('specialism')).map((s) => s.id);
		const matched = intersection(values, specialisms);
		if (matched.length === 0) {
			return res.status(400).send({ errors: { specialisms: ERROR_NOT_FOUND } });
		}
	}
	next();
};
