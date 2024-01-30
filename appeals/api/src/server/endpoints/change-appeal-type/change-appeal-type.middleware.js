import {
	ERROR_NOT_FOUND,
	ERROR_INVALID_APPEAL_STATE,
	STATE_TARGET_INVALID,
	STATE_TARGET_CLOSED,
	STATE_TARGET_COMPLETE,
	STATE_TARGET_AWAITING_TRANSFER,
	STATE_TARGET_TRANSFERRED,
	STATE_TARGET_WITHDRAWN
} from '#endpoints/constants.js';
import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<Response | void>}
 */
export const loadAllAppealTypesAndAddToRequest = async (req, res, next) => {
	const allAppealTypes = await databaseConnector.appealType.findMany();
	req.appealTypes = allAppealTypes;
	next();
};

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateAppealType = async (req, res, next) => {
	const { newAppealTypeId } = req.body;
	const match =
		req.appealTypes.findIndex((appealType) => appealType.id === Number(newAppealTypeId)) > -1;
	if (!match) {
		return res.status(400).send({ errors: { newAppealTypeId: ERROR_NOT_FOUND } });
	}
	next();
};

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateAppealStatus = async (req, res, next) => {
	const isValidStatus =
		[
			STATE_TARGET_CLOSED,
			STATE_TARGET_COMPLETE,
			STATE_TARGET_INVALID,
			STATE_TARGET_AWAITING_TRANSFER,
			STATE_TARGET_TRANSFERRED,
			STATE_TARGET_WITHDRAWN
		].indexOf(req.appeal.appealStatus[0].status) === -1;

	if (!isValidStatus) {
		return res.status(400).send({ errors: { appealStatus: ERROR_INVALID_APPEAL_STATE } });
	}
	next();
};

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateAppealStatusForTransfer = async (req, res, next) => {
	const isValidStatus = req.appeal.appealStatus[0].status === STATE_TARGET_AWAITING_TRANSFER;

	if (!isValidStatus) {
		return res.status(400).send({ errors: { appealStatus: ERROR_INVALID_APPEAL_STATE } });
	}
	next();
};
