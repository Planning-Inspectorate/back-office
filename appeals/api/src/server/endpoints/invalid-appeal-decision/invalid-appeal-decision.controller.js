import { publishInvalidDecision } from './invalid-appeal-decision.service.js';
import {
	ERROR_INVALID_APPEAL_STATE,
	STATE_TARGET_ISSUE_DETERMINATION
} from '#endpoints/constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const postInvalidDecision = async (req, res) => {
	const { appeal } = req;
	const { invalidDecisionReason } = req.body;

	if (appeal.appealStatus[0].status !== STATE_TARGET_ISSUE_DETERMINATION) {
		res.status(400).send({ errors: { state: ERROR_INVALID_APPEAL_STATE } });
	}

	const decision = await publishInvalidDecision(
		appeal,
		invalidDecisionReason,
		req.get('azureAdUserId') || ''
	);

	return res.send(decision);
};
