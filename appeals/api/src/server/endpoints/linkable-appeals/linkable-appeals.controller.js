import { getLinkableAppealSummaryByCaseReference } from './linkable-appeals.service.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const getLinkableAppealById = async (req, res) => {
	const { appealReference } = req.params;
	try {
		return res.send(await getLinkableAppealSummaryByCaseReference(appealReference));
	} catch (error) {
		console.log('Trigger 5');
		if (error === 404) {
			return res.status(404).send();
		} else {
			return res.status(500).send();
		}
	}
};
