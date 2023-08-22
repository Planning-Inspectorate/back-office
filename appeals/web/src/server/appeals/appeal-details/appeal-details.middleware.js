import { getAppealDetailsFromId } from './appeal-details.service.js';

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<void>}
 */
export const validateAppeal = async (req, res, next) => {
	const { appealId } = req.params;
	const appeal = await getAppealDetailsFromId(req.apiClient, appealId);
	if (!appeal) {
		return res.status(404).render('app/404');
	}
	req.currentAppeal = appeal;
	next();
};
