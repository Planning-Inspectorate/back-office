import * as service from './transferred-appeal.services.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const getTransferredAppealStatusByCaseReference = async (req, res) => {
	const { appealReference } = req.params;
	try {
		const response = await service.getTransferredAppealStatusByCaseReference(appealReference);
		return res.status(200).send(response);
	} catch (error) {
		if (error === 404) {
			return res.status(200).send({ caseFound: false });
		} else {
			return res.status(500).send();
		}
	}
};
