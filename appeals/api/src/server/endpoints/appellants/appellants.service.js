import { ERROR_NOT_FOUND } from '../constants.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {Promise<object | void>}
 */
const checkAppellantExists = async (req, res, next) => {
	const {
		appeal,
		params: { appellantId }
	} = req;
	const hasAppellant = appeal.appellant?.id === Number(appellantId);

	if (!hasAppellant) {
		return res.status(404).send({ errors: { appellantId: ERROR_NOT_FOUND } });
	}

	next();
};

export { checkAppellantExists };
