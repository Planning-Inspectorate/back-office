import {
	STATE_TARGET_COMPLETE,
	STATE_TARGET_FINAL_COMMENT_REVIEW,
	STATE_TARGET_INVALID,
	STATE_TARGET_ISSUE_DETERMINATION,
	STATE_TARGET_LPA_QUESTIONNAIRE_DUE,
	STATE_TARGET_READY_TO_START,
	STATE_TARGET_STATEMENT_REVIEW,
	STATE_TARGET_ASSIGN_CASE_OFFICER,
	STATE_TARGET_WITHDRAWN,
	STATE_TARGET_CLOSED,
	STATE_TARGET_AWAITING_TRANSFER,
	STATE_TARGET_TRANSFERRED,
	ERROR_MUST_BE_BOOLEAN,
	ERROR_MUST_BE_VALID_APPEAL_STATE
} from '#endpoints/constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateHasInspector = async (req, res, next) => {
	const hasInspector = req.query.hasInspector;

	if (hasInspector !== undefined && hasInspector !== 'true' && hasInspector !== 'false') {
		return res.status(400).send({ errors: { hasInspector: ERROR_MUST_BE_BOOLEAN } });
	}

	next();
};

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateAppealStatus = async (req, res, next) => {
	const status = req.query.status;
	const validStatuses = [
		STATE_TARGET_COMPLETE,
		STATE_TARGET_FINAL_COMMENT_REVIEW,
		STATE_TARGET_INVALID,
		STATE_TARGET_ISSUE_DETERMINATION,
		STATE_TARGET_LPA_QUESTIONNAIRE_DUE,
		STATE_TARGET_READY_TO_START,
		STATE_TARGET_STATEMENT_REVIEW,
		STATE_TARGET_ASSIGN_CASE_OFFICER,
		STATE_TARGET_WITHDRAWN,
		STATE_TARGET_CLOSED,
		STATE_TARGET_AWAITING_TRANSFER,
		STATE_TARGET_TRANSFERRED
	];

	const isValidStatus = typeof status === 'string' ? validStatuses.includes(status) : !status;

	if (!isValidStatus) {
		return res.status(400).send({ errors: { status: ERROR_MUST_BE_VALID_APPEAL_STATE } });
	}
	next();
};
