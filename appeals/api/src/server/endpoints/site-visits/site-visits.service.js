/** @typedef {import('express').RequestHandler} RequestHandler */

import { ERROR_NOT_FOUND } from '#endpoints/constants.js';

/**
 * @type {RequestHandler}
 * @returns {Promise<object | void>}
 */
const checkSiteVisitExists = async (req, res, next) => {
	const {
		appeal,
		params: { siteVisitId }
	} = req;
	const hasSiteVisit = appeal.siteVisit?.id === Number(siteVisitId);

	if (!hasSiteVisit) {
		return res.status(404).send({ errors: { siteVisitId: ERROR_NOT_FOUND } });
	}

	next();
};

export { checkSiteVisitExists };
