import { ERROR_MUST_BE_SET_AS_HEADER } from '#endpoints/constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response | void}
 */
const checkAzureAdUserIdHeaderExists = (req, res, next) => {
	if (!req.get('azureAdUserId')) {
		return res.status(400).send({
			errors: {
				azureAdUserId: ERROR_MUST_BE_SET_AS_HEADER
			}
		});
	}

	next();
};

export default checkAzureAdUserIdHeaderExists;
